/** 온보딩에서 선택하는 관심사 태그. AI 맞춤 놀이 추천의 컨텍스트로 쓰인다. */
export const INTEREST_OPTIONS = [
  '자동차·탈것',
  '동물',
  '공룡',
  '그림 그리기',
  '블록·쌓기',
  '물놀이',
  '음악·노래',
  '춤·몸놀이',
  '책·이야기',
  '소꿉놀이',
  '숫자·글자',
  '바깥놀이',
] as const

export type Interest = (typeof INTEREST_OPTIONS)[number]

export function isValidInterest(value: string): value is Interest {
  return (INTEREST_OPTIONS as readonly string[]).includes(value)
}
