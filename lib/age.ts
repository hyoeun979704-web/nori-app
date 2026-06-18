/**
 * 생년월일 기반 개월수 계산 유틸.
 * 노리는 또래 평균과 비교하지 않는다 — 개월수는 오직 '내 아이에게 맞는 놀이'를
 * 고르기 위한 입력값으로만 쓰인다.
 */

/** 생년월일로부터 만 개월수를 계산한다. (예: 26) */
export function ageInMonths(birthDate: string | Date, now: Date = new Date()): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())
  // 이번 달에서 '일' 기준으로 생일이 아직 안 지났으면 1개월 차감
  if (now.getDate() < birth.getDate()) {
    months -= 1
  }
  return Math.max(0, months)
}

/**
 * 화면 표기용 한국어 나이 라벨.
 * - 24개월 미만: "생후 N개월"
 * - 24개월 이상: "만 X세 Y개월" (Y가 0이면 "만 X세")
 */
export function formatAge(birthDate: string | Date, now: Date = new Date()): string {
  const months = ageInMonths(birthDate, now)
  if (months < 24) {
    return `생후 ${months}개월`
  }
  const years = Math.floor(months / 12)
  const remainder = months % 12
  return remainder === 0 ? `만 ${years}세` : `만 ${years}세 ${remainder}개월`
}

/** date input(yyyy-mm-dd) 검증용. 미래 날짜·비현실적 과거를 거른다. */
export function isValidBirthDate(value: string, now: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  if (date.getTime() > now.getTime()) return false
  // 만 8세 이상은 영유아 놀이 대상 범위를 벗어나므로 입력 단계에서 막는다.
  const eightYearsAgo = new Date(now)
  eightYearsAgo.setFullYear(eightYearsAgo.getFullYear() - 8)
  if (date.getTime() < eightYearsAgo.getTime()) return false
  return true
}
