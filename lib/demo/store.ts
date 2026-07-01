// 프로토타입용 로컬 저장소 (백엔드·로그인 없이 localStorage)
import type { AgeKey, Recipe } from './recipes'

export type Profile = {
  name: string
  age: AgeKey
  interests: string[]
}

export type HistoryItem = {
  title: string
  emoji: string
  domains?: string[]
  date: string // YYYY-MM-DD
}

const P_KEY = 'nori.profile'
const H_KEY = 'nori.history'
const T_KEY = 'nori.today'

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

// ── 프로필 ──
export function getProfile(): Profile | null {
  return read<Profile | null>(P_KEY, null)
}
export function saveProfile(p: Profile) {
  write(P_KEY, p)
}
export function clearAll() {
  if (typeof window === 'undefined') return
  ;[P_KEY, H_KEY, T_KEY].forEach((k) => window.localStorage.removeItem(k))
}

// ── 놀이 기록 (유대 타임라인) ──
export function getHistory(): HistoryItem[] {
  return read<HistoryItem[]>(H_KEY, [])
}
export function addHistory(r: Recipe) {
  const list = getHistory()
  list.unshift({
    title: r.title,
    emoji: r.emoji,
    domains: r.domains,
    date: todayStr(),
  })
  write(H_KEY, list.slice(0, 200))
}

// 연속으로 함께 논 날짜 수 (streak)
export function getStreak(): number {
  const dates = Array.from(new Set(getHistory().map((h) => h.date))).sort(
    (a, b) => (a < b ? 1 : -1),
  )
  const first = dates[0]
  if (!first) return 0
  const today = todayStr()
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (first !== today && first !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i - 1]
    const cur = dates[i]
    if (!prev || !cur) break
    const diff =
      new Date(prev + 'T00:00:00Z').getTime() -
      new Date(cur + 'T00:00:00Z').getTime()
    if (diff === 86400000) streak++
    else break
  }
  return streak
}

// ── 오늘의 놀이 캐시 (하루 고정) ──
export function getTodayCache(): Recipe | null {
  const t = read<{ date: string; recipe: Recipe } | null>(T_KEY, null)
  if (t && t.date === todayStr()) return t.recipe
  return null
}
export function setTodayCache(recipe: Recipe) {
  write(T_KEY, { date: todayStr(), recipe })
}
