export type Age = { years: number; months: number; totalMonths: number };

export function ageFromBirthDate(birthISO: string, now: Date = new Date()): Age {
  const [y, m, d] = birthISO.split("-").map((v) => Number.parseInt(v, 10));
  if (!y || !m || !d) return { years: 0, months: 0, totalMonths: 0 };
  const birth = new Date(y, m - 1, d);
  let totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) totalMonths -= 1;
  if (totalMonths < 0) totalMonths = 0;
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    totalMonths,
  };
}

export function formatAgeKo(birthISO: string): string {
  const { years, months, totalMonths } = ageFromBirthDate(birthISO);
  if (totalMonths < 12) return `${totalMonths}개월`;
  return `만 ${years}세 ${months}개월`;
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
