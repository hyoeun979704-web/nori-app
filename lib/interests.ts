export const INTERESTS = [
  "블록 · 만들기",
  "그림 · 색칠",
  "책 · 이야기",
  "역할놀이",
  "음악 · 율동",
  "몸놀이 · 바깥",
  "촉감 · 물놀이",
  "과학 · 탐구",
  "요리 · 생활",
] as const;

export type Interest = (typeof INTERESTS)[number];
