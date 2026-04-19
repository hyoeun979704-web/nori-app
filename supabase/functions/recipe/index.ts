// Gemini-backed play-recipe Edge Function.
//
// Pipeline
// --------
// 1. Authenticate user via incoming JWT (fail closed if absent).
// 2. Per-user rate limit — check `recipe_call_log` for the last minute.
// 3. Server-side Red Flag match (regex rules mirrored from
//    `lib/red-flags.ts`). On match return the hardcoded consultation
//    message and never call Gemini.
// 4. Fetch the user's `children` + `child_surveys` (RLS-scoped via the
//    user's JWT), build a private prompt context from age/interests and
//    the surveyed allergies/sensitivities/notes.
// 5. Pull internal `dev_milestones` + `dev_play_activities` rows for the
//    nearest age checkpoint as inspiration hints.
// 6. Call Gemini with a strict responseSchema so the output conforms to
//    { title, age_range, materials[], steps[], tip, safety_note }.
// 7. Validate the shape (including non-empty arrays) before returning.
//    Any deviation → 502.
//
// Env vars (supabase secrets):
//   GEMINI_API_KEY      — required. NEVER exposed to the client.
//   GEMINI_MODEL        — optional. Defaults to "gemini-2.5-flash".
//
// Deploy:
//   supabase functions deploy recipe

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import { corsHeaders } from "../_shared/cors.ts";

// ---------------------------------------------------------------------------
// Red Flag rules — MUST stay byte-for-byte identical with lib/red-flags.ts.
// ---------------------------------------------------------------------------
type RedFlagRule = { id: string; pattern: string; description: string };

const RED_FLAG_RULES: readonly RedFlagRule[] = [
  { id: "seizure", pattern: "경련|발작", description: "경련·발작" },
  { id: "loss_of_consciousness", pattern: "의식(\\s*이|\\s*을)?\\s*(없|잃|안\\s*돌아)", description: "의식 이상" },
  { id: "breathing", pattern: "숨(\\s*을|\\s*이)?\\s*(안|못)\\s*(쉬|쉽)", description: "호흡 곤란" },
  { id: "high_fever", pattern: "(열|체온)\\s*(이|을)?\\s*(39|40|41)\\s*도?", description: "고열" },
  { id: "bleeding", pattern: "피(\\s*가|\\s*를)?\\s*(멈추지|안\\s*멈)", description: "출혈 지속" },
  { id: "ingestion", pattern: "(삼켰|삼키었|이물질\\s*을?\\s*삼)", description: "이물질 삼킴" },
  { id: "serious_injury", pattern: "심하게\\s*다(쳤|침|쳐)", description: "큰 부상" },
  { id: "head_injury", pattern: "머리(\\s*를|\\s*가)?\\s*(부딪|다쳤|깨졌)", description: "머리 부상" },
  { id: "burn", pattern: "화상(\\s*을|\\s*이)?\\s*(입|있|심)", description: "화상" },
  { id: "poisoning", pattern: "중독(\\s*이|\\s*을)?\\s*(된|되었|의심)", description: "중독 의심" },
  { id: "no_speech", pattern: "말(\\s*을|\\s*이)?\\s*(한\\s*마디도|전혀|하나도)\\s*(못|안)", description: "언어 지연" },
  { id: "no_walking", pattern: "걷지(\\s*를)?\\s*(못|않)(하|아|네)", description: "걷기 지연" },
  { id: "no_eye_contact", pattern: "눈(\\s*을|\\s*이)?\\s*(마주치지|맞추지)\\s*(않|못|안)", description: "눈맞춤 안 됨" },
  { id: "no_name_response", pattern: "이름(\\s*을)?\\s*불러도\\s*(돌아보지|반응하지|쳐다보지)\\s*(않|못|안)", description: "호명 반응 없음" },
  { id: "developmental_delay", pattern: "발달(\\s*이|\\s*을)?\\s*(늦|지연|문제)", description: "발달 우려" },
  { id: "autism_concern", pattern: "자폐(\\s*스펙트럼)?(\\s*인가|\\s*같|\\s*아닐까|\\s*진단)", description: "자폐 우려" },
  { id: "adhd_concern", pattern: "(adhd|주의력\\s*결핍)(\\s*인가|\\s*같|\\s*아닐까|\\s*진단)?", description: "ADHD 우려" },
];

const RED_FLAG_MESSAGE =
  "말씀해 주신 내용은 전문가의 상담이 도움이 될 수 있는 부분이에요. " +
  "가까운 소아청소년과, 혹은 지역 육아종합지원센터·발달지원센터에서 전문가를 먼저 만나 보시길 권해요. " +
  "노리는 놀이 추천을 돕는 서비스로, 의학적 판단이나 진단을 대신할 수 없어요.";

function matchRedFlag(text: string): RedFlagRule | null {
  for (const rule of RED_FLAG_RULES) {
    if (new RegExp(rule.pattern, "iu").test(text)) return rule;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Rate limiting (in-database, per-user, rolling 60s window)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX = 10;

// ---------------------------------------------------------------------------
// Age checkpoint math
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
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
    typeof v.title === "string" && v.title.trim().length > 0 &&
    typeof v.age_range === "string" && v.age_range.trim().length > 0 &&
    Array.isArray(v.materials) &&
    v.materials.length >= 1 &&
    v.materials.every((m) => typeof m === "string" && m.trim().length > 0) &&
    Array.isArray(v.steps) &&
    v.steps.length >= 1 &&
    v.steps.every((s) => typeof s === "string" && s.trim().length > 0) &&
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
};

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
   steps는 3~6개, materials는 집에서 쉽게 구할 수 있는 것들로, 최소 1개.
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
    args.milestones.forEach((m) => parts.push(`- [${m.domain}] ${m.description_ko}`));
  }

  if (args.activities.length > 0) {
    parts.push("");
    parts.push("같은 연령대를 위한 공공기관 권장 놀이 (영감 참고용, 그대로 베끼지 말 것):");
    args.activities.forEach((a) => parts.push(`- ${a.title_ko}: ${a.summary_ko}`));
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

// Never log a raw prompt or model response — both may contain child PII
// (allergies, medical notes, nickname). A short hash lets us correlate logs
// without persisting content.
async function contentHash(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const arr = Array.from(new Uint8Array(digest));
  return arr.slice(0, 6).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
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
  const geminiModel = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
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

  // --- Rate limit ---------------------------------------------------------
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_SEC * 1000,
  ).toISOString();
  const { count: recentCount, error: countErr } = await supabase
    .from("recipe_call_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", windowStart);
  if (countErr) console.error("rate limit count failed", countErr.message);
  if ((recentCount ?? 0) >= RATE_LIMIT_MAX) {
    return json(
      {
        error: "rate_limited",
        message:
          "짧은 시간에 너무 많이 요청했어요. 잠시 후 다시 시도해 주세요.",
      },
      429,
    );
  }

  // Log this call before expensive work so parallel calls are counted.
  await supabase.from("recipe_call_log").insert({ user_id: user.id });
  // Best-effort cleanup of old rows.
  void supabase
    .from("recipe_call_log")
    .delete()
    .eq("user_id", user.id)
    .lt("created_at", new Date(Date.now() - 3600 * 1000).toISOString());

  // --- Parse body ---------------------------------------------------------
  let body: { prompt?: unknown };
  try {
    const raw = await req.text();
    if (raw.length > 4096) return json({ error: "body too large" }, 413);
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return json({ error: "invalid json body" }, 400);
  }
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) return json({ error: "empty prompt" }, 400);
  if (prompt.length > 500) return json({ error: "prompt too long" }, 400);

  // --- Red Flag -----------------------------------------------------------
  const redFlag = matchRedFlag(prompt);
  if (redFlag) {
    console.log("red_flag", {
      user: user.id.slice(0, 8),
      rule: redFlag.id,
    });
    return json({ type: "red_flag", message: RED_FLAG_MESSAGE });
  }

  // --- Gather context via RLS-scoped queries -----------------------------
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
  const promptDigest = await contentHash(userMessage);

  // --- Call Gemini with timeout ------------------------------------------
  const geminiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=` +
    encodeURIComponent(geminiKey);

  let geminiRes: Response;
  try {
    geminiRes = await fetchWithTimeout(
      geminiUrl,
      {
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
      },
      15_000,
    );
  } catch (e) {
    console.error("gemini fetch failed", {
      digest: promptDigest,
      reason: e instanceof Error ? e.name : "unknown",
    });
    return json({ error: "upstream_unavailable" }, 504);
  }

  if (!geminiRes.ok) {
    console.error("gemini non-200", {
      digest: promptDigest,
      status: geminiRes.status,
    });
    return json({ error: "upstream_error" }, 502);
  }

  const geminiData = (await geminiRes.json().catch(() => null)) as
    | { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    | null;
  const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("gemini empty response", { digest: promptDigest });
    return json({ error: "empty_response" }, 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    console.error("gemini non-json", { digest: promptDigest });
    return json({ error: "invalid_json_from_model" }, 502);
  }
  if (!isValidRecipe(parsed)) {
    console.error("gemini shape mismatch", { digest: promptDigest });
    return json({ error: "invalid_recipe_shape" }, 502);
  }

  return json({ type: "recipe", recipe: parsed });
});
