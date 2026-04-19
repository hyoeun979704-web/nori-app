// Gemini-backed play-recipe Edge Function.
//
// Flow:
//   1. Authenticate user via incoming JWT (fails closed if missing).
//   2. Server-side Red Flag match — if triggered, never call Gemini; return
//      the hardcoded consultation message. This mirrors lib/red-flags.ts on
//      the client; both lists MUST stay in sync.
//   3. Fetch the user's `children` + `child_surveys` rows (RLS-scoped via
//      the user's JWT) and build an AI-only context from age/interests and
//      the private survey (allergies, sensitivities, notes).
//   4. Pull internal dev_milestones + dev_play_activities rows for the
//      nearest age checkpoint and inject them as inspiration hints.
//   5. Call Gemini with a strict responseSchema so the output conforms to
//      { title, age_range, materials[], steps[], tip, safety_note }.
//   6. Validate the shape before returning. Any deviation → 502.
//
// Env vars (supabase secrets):
//   GEMINI_API_KEY — required. NEVER exposed to the client.
//
// Deploy:
//   supabase functions deploy recipe --no-verify-jwt=false

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import { corsHeaders } from "../_shared/cors.ts";

// Keep in sync with lib/red-flags.ts
const RED_FLAG_PATTERNS: readonly string[] = [
  "경련", "발작", "의식이 없", "숨을 안 쉬", "숨을 못 쉬", "호흡이 이상",
  "39도", "40도", "고열", "심하게 다쳤", "머리를 부딪", "피가 멈추지 않",
  "삼켰어요", "이물질", "중독", "화상",
  "말을 한마디도", "말을 전혀", "말이 너무 늦", "걷지를 못", "걷지 못해",
  "눈을 마주치지 않", "이름을 불러도 돌아보지 않", "반응이 없어요",
  "발달이 늦", "발달 지연", "자폐", "자폐 스펙트럼", "ADHD", "주의력결핍",
];
const RED_FLAG_MESSAGE =
  "말씀해 주신 내용은 전문가의 상담이 도움이 될 수 있는 부분이에요. " +
  "가까운 소아청소년과, 혹은 지역 육아종합지원센터·발달지원센터에서 전문가를 먼저 만나 보시길 권해요. " +
  "노리는 놀이 추천을 돕는 서비스로, 의학적 판단이나 진단을 대신할 수 없어요.";

function containsRedFlag(text: string): boolean {
  const lower = text.toLowerCase();
  return RED_FLAG_PATTERNS.some((p) => lower.includes(p.toLowerCase()));
}

const CHECKPOINTS = [2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60, 72, 84] as const;

function monthsBetween(birth: Date, now: Date): number {
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

function nearestCheckpoint(ageMonths: number): number {
  let best = CHECKPOINTS[0];
  let bestDiff = Math.abs(ageMonths - best);
  for (const c of CHECKPOINTS) {
    const diff = Math.abs(ageMonths - c);
    if (diff < bestDiff) {
      best = c;
      bestDiff = diff;
    }
  }
  return best;
}

type Child = {
  id: string;
  nickname: string;
  birth_date: string;
  interests: string[];
};
type Survey = {
  allergies: string[];
  sensitivities: string[];
  notes: string;
};
type Milestone = { domain: string; description_ko: string };
type Activity = {
  title_ko: string;
  summary_ko: string;
  domains: string[];
  materials: string[];
};

type Recipe = {
  title: string;
  age_range: string;
  materials: string[];
  steps: string[];
  tip: string;
  safety_note: string;
};

function isValidRecipe(value: unknown): value is Recipe {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.title === "string" &&
    typeof v.age_range === "string" &&
    Array.isArray(v.materials) &&
    v.materials.every((m) => typeof m === "string") &&
    Array.isArray(v.steps) &&
    v.steps.every((s) => typeof s === "string") &&
    typeof v.tip === "string" &&
    typeof v.safety_note === "string"
  );
}

const RECIPE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    age_range: { type: "string" },
    materials: { type: "array", items: { type: "string" } },
    steps: { type: "array", items: { type: "string" } },
    tip: { type: "string" },
    safety_note: { type: "string" },
  },
  required: ["title", "age_range", "materials", "steps", "tip", "safety_note"],
} as const;

const SYSTEM_INSTRUCTION = `당신은 영유아(0~7세) 부모를 돕는 놀이 가이드 "노리"입니다.
다음 규칙을 절대 어기지 마세요.

1. 또래 평균·발달 단계와 비교하는 표현을 쓰지 마세요. ("보통 이 시기 아이들보다 빠르다/느리다" 금지)
2. "발달 지연", "늦됨", "문제가 있을 수 있다" 같은 단정적·진단적 표현을 쓰지 마세요.
3. 의학적 진단이나 조언을 하지 마세요. 증상이 의심되면 놀이를 제안하지 말고 전문가 상담을 권하세요.
4. 아이의 현재 상태를 긍정적이고 구체적으로 묘사하세요.
5. 알레르기·민감 반응·특이사항 정보가 제공되면 해당 재료·자극을 놀이에서 반드시 제외하세요.
6. age_range는 "N~M개월" 형식으로만 쓰세요 (예: "24~36개월").
7. safety_note는 한 문장으로 명확하고 짧게. 예: "작은 부품이 있다면 삼키지 않도록 지켜봐 주세요."
8. 반드시 JSON 스키마 { title, age_range, materials[], steps[], tip, safety_note }로만 답하세요.
   steps는 3~6개, materials는 집에서 쉽게 구할 수 있는 것들로.
9. 쿠팡·YouTube·브랜드명을 넣지 마세요 (앱이 별도로 링크를 붙여요).`;

function buildUserMessage(args: {
  prompt: string;
  child: Child | null;
  survey: Survey | null;
  milestones: Milestone[];
  activities: Activity[];
}): string {
  const parts: string[] = [];
  parts.push(`부모의 요청: ${args.prompt}`);

  if (args.child) {
    const birth = new Date(args.child.birth_date);
    const ageMonths = monthsBetween(birth, new Date());
    parts.push("");
    parts.push(`아이 정보:`);
    parts.push(`- 호칭: ${args.child.nickname}`);
    parts.push(`- 개월 수: ${ageMonths}개월`);
    if (args.child.interests.length > 0) {
      parts.push(`- 관심사: ${args.child.interests.join(", ")}`);
    }
  }

  if (args.survey) {
    const privateParts: string[] = [];
    if (args.survey.allergies.length > 0)
      privateParts.push(`알레르기: ${args.survey.allergies.join(", ")}`);
    if (args.survey.sensitivities.length > 0)
      privateParts.push(`민감 반응: ${args.survey.sensitivities.join(", ")}`);
    if (args.survey.notes) privateParts.push(`참고 메모: ${args.survey.notes}`);
    if (privateParts.length > 0) {
      parts.push("");
      parts.push("부모가 공유한 비공개 정보 (화면에 드러내지 말고 놀이에 반영만):");
      privateParts.forEach((p) => parts.push(`- ${p}`));
    }
  }

  if (args.milestones.length > 0) {
    parts.push("");
    parts.push("이 연령대 아이들이 보이는 행동 (참고용 · 비교·진단 표현 금지):");
    args.milestones.forEach((m) =>
      parts.push(`- [${m.domain}] ${m.description_ko}`),
    );
  }

  if (args.activities.length > 0) {
    parts.push("");
    parts.push("같은 연령대를 위한 공공기관 권장 놀이 (영감 참고용, 그대로 베끼지 말 것):");
    args.activities.forEach((a) =>
      parts.push(`- ${a.title_ko}: ${a.summary_ko}`),
    );
  }

  parts.push("");
  parts.push("위 정보를 종합해 이 아이에게 딱 맞는 놀이 한 가지를 JSON으로 답해 주세요.");
  return parts.join("\n");
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "missing authorization" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!supabaseUrl || !supabaseAnonKey || !geminiKey) {
    console.error("missing required env var");
    return json({ error: "server misconfigured" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return json({ error: "unauthorized" }, 401);

  let body: { prompt?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json body" }, 400);
  }
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) return json({ error: "empty prompt" }, 400);
  if (prompt.length > 500) return json({ error: "prompt too long" }, 400);

  if (containsRedFlag(prompt)) {
    return json({ type: "red_flag", message: RED_FLAG_MESSAGE });
  }

  // RLS ensures users only see their own child
  const { data: childRow } = await supabase
    .from("children")
    .select("id, nickname, birth_date, interests")
    .maybeSingle();
  const child = (childRow ?? null) as Child | null;

  let survey: Survey | null = null;
  let milestones: Milestone[] = [];
  let activities: Activity[] = [];

  if (child) {
    const { data: surveyRow } = await supabase
      .from("child_surveys")
      .select("allergies, sensitivities, notes")
      .eq("child_id", child.id)
      .maybeSingle();
    if (surveyRow) survey = surveyRow as Survey;

    const ageMonths = monthsBetween(new Date(child.birth_date), new Date());
    const checkpoint = nearestCheckpoint(ageMonths);

    const { data: milestoneRows } = await supabase
      .from("dev_milestones")
      .select("domain, description_ko")
      .eq("age_months", checkpoint)
      .eq("is_active", true);
    milestones = (milestoneRows ?? []) as Milestone[];

    const { data: activityRows } = await supabase
      .from("dev_play_activities")
      .select("title_ko, summary_ko, domains, materials")
      .lte("age_months_min", ageMonths)
      .gte("age_months_max", ageMonths)
      .eq("is_active", true)
      .limit(6);
    activities = (activityRows ?? []) as Activity[];
  }

  const userMessage = buildUserMessage({ prompt, child, survey, milestones, activities });

  const geminiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    encodeURIComponent(geminiKey);

  let geminiRes: Response;
  try {
    geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RECIPE_SCHEMA,
          temperature: 0.8,
          maxOutputTokens: 1024,
        },
      }),
    });
  } catch (e) {
    console.error("gemini fetch failed", e);
    return json({ error: "upstream unavailable" }, 502);
  }

  if (!geminiRes.ok) {
    const body = await geminiRes.text().catch(() => "");
    console.error("gemini non-200", geminiRes.status, body);
    return json({ error: "upstream error" }, 502);
  }

  const geminiData = await geminiRes.json().catch(() => null) as
    | { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    | null;
  const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("gemini empty response", JSON.stringify(geminiData));
    return json({ error: "empty response" }, 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    console.error("gemini non-json", text.slice(0, 200));
    return json({ error: "invalid json from model" }, 502);
  }
  if (!isValidRecipe(parsed)) {
    console.error("gemini shape mismatch", JSON.stringify(parsed).slice(0, 400));
    return json({ error: "invalid recipe shape" }, 502);
  }

  return json({ type: "recipe", recipe: parsed });
});
