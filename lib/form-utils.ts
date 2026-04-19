export function splitTags(raw: string): string[] {
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function toggleArrayValue<T>(arr: readonly T[], value: T): T[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value];
}
