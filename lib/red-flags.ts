// Red Flag keyword matcher.
//
// Used both client-side (instant UX before hitting the server) and mirrored
// in the Edge Function (`supabase/functions/recipe/index.ts`) for defence
// in depth. Both lists MUST stay in sync; if you edit one, edit the other.
//
// When a red flag triggers, we never call the AI — we return a hardcoded
// message steering the parent toward professional consultation. This is a
// legal/ethical boundary, not a UX nicety.

export const RED_FLAG_PATTERNS: readonly string[] = [
  // Medical emergency / urgent safety
  "경련",
  "발작",
  "의식이 없",
  "숨을 안 쉬",
  "숨을 못 쉬",
  "호흡이 이상",
  "39도",
  "40도",
  "고열",
  "심하게 다쳤",
  "머리를 부딪",
  "피가 멈추지 않",
  "삼켰어요",
  "이물질",
  "중독",
  "화상",
  // Persistent developmental concerns requiring specialist evaluation
  "말을 한마디도",
  "말을 전혀",
  "말이 너무 늦",
  "걷지를 못",
  "걷지 못해",
  "눈을 마주치지 않",
  "이름을 불러도 돌아보지 않",
  "반응이 없어요",
  "발달이 늦",
  "발달 지연",
  "자폐",
  "자폐 스펙트럼",
  "ADHD",
  "주의력결핍",
];

export const RED_FLAG_MESSAGE =
  "말씀해 주신 내용은 전문가의 상담이 도움이 될 수 있는 부분이에요. " +
  "가까운 소아청소년과, 혹은 지역 육아종합지원센터·발달지원센터에서 전문가를 먼저 만나 보시길 권해요. " +
  "노리는 놀이 추천을 돕는 서비스로, 의학적 판단이나 진단을 대신할 수 없어요.";

export function containsRedFlag(input: string): boolean {
  const normalised = input.toLowerCase();
  return RED_FLAG_PATTERNS.some((pattern) =>
    normalised.includes(pattern.toLowerCase()),
  );
}
