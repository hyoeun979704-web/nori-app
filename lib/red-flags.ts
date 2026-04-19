// Red Flag rule engine.
//
// Each rule is a regex applied (case-insensitively) against the parent's
// prompt. If *any* rule matches, we refuse to call Gemini and return the
// hardcoded consultation message below.
//
// Design notes
// ------------
// Earlier versions used bare substring matching. That over-fires: "고열을
// 식혀주는 놀이" contains "고열" but is a perfectly fine request. The rules
// below tighten each pattern with surrounding context (particles, negation,
// follow-up verbs) so the match fires only when the parent is describing
// the concern rather than asking to play around it.
//
// IMPORTANT: the mirror in `supabase/functions/recipe/index.ts` must stay
// byte-for-byte identical with `RED_FLAG_RULES` and `RED_FLAG_MESSAGE`. If
// you edit one, edit the other in the same commit.

export type RedFlagRule = {
  id: string;
  pattern: string; // source for new RegExp(pattern, "iu")
  description: string;
};

export const RED_FLAG_RULES: readonly RedFlagRule[] = [
  // Acute medical / safety
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

  // Persistent developmental concerns that warrant specialist evaluation
  { id: "no_speech", pattern: "말(\\s*을|\\s*이)?\\s*(한\\s*마디도|전혀|하나도)\\s*(못|안)", description: "언어 지연" },
  { id: "no_walking", pattern: "걷지(\\s*를)?\\s*(못|않)(하|아|네)", description: "걷기 지연" },
  { id: "no_eye_contact", pattern: "눈(\\s*을|\\s*이)?\\s*(마주치지|맞추지)\\s*(않|못|안)", description: "눈맞춤 안 됨" },
  { id: "no_name_response", pattern: "이름(\\s*을)?\\s*불러도\\s*(돌아보지|반응하지|쳐다보지)\\s*(않|못|안)", description: "호명 반응 없음" },
  { id: "developmental_delay", pattern: "발달(\\s*이|\\s*을)?\\s*(늦|지연|문제)", description: "발달 우려" },
  { id: "autism_concern", pattern: "자폐(\\s*스펙트럼)?(\\s*인가|\\s*같|\\s*아닐까|\\s*진단)", description: "자폐 우려" },
  { id: "adhd_concern", pattern: "(adhd|주의력\\s*결핍)(\\s*인가|\\s*같|\\s*아닐까|\\s*진단)?", description: "ADHD 우려" },
];

export const RED_FLAG_MESSAGE =
  "말씀해 주신 내용은 전문가의 상담이 도움이 될 수 있는 부분이에요. " +
  "가까운 소아청소년과, 혹은 지역 육아종합지원센터·발달지원센터에서 전문가를 먼저 만나 보시길 권해요. " +
  "노리는 놀이 추천을 돕는 서비스로, 의학적 판단이나 진단을 대신할 수 없어요.";

export function matchRedFlag(input: string): RedFlagRule | null {
  for (const rule of RED_FLAG_RULES) {
    if (new RegExp(rule.pattern, "iu").test(input)) return rule;
  }
  return null;
}

export function containsRedFlag(input: string): boolean {
  return matchRedFlag(input) !== null;
}
