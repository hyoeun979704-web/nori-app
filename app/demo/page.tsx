'use client'

import { useEffect, useRef, useState } from 'react'
import { AGES, type AgeKey, type Recipe } from '@/lib/demo/recipes'
import {
  getProfile,
  saveProfile,
  clearAll,
  getHistory,
  addHistory,
  getStreak,
  getTodayCache,
  setTodayCache,
  type Profile,
  type HistoryItem,
} from '@/lib/demo/store'

type Source = 'ai' | 'sample' | 'sample-fallback'
type Tab = 'today' | 'play' | 'history' | 'ask'

const INTERESTS = [
  '🦕 공룡',
  '🚗 자동차',
  '🐰 동물',
  '👑 역할놀이',
  '🎨 그림',
  '💧 물놀이',
  '🎵 노래·율동',
  '🧱 블록·만들기',
  '📚 책·이야기',
  '🏃 몸으로 뛰기',
]

export default function DemoPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>('today')

  useEffect(() => {
    setProfile(getProfile())
    setReady(true)
  }, [])

  if (!ready) return <div className="min-h-screen bg-[#FBF7F0]" />

  if (!profile) {
    return <Onboarding onDone={(p) => setProfile(p)} />
  }

  return (
    <main className="min-h-screen bg-[#FBF7F0] text-stone-800">
      <div className="mx-auto max-w-md px-5 pb-28 pt-8">
        {tab === 'today' && <TodayView profile={profile} goPlay={() => setTab('play')} />}
        {tab === 'play' && <PlayView profile={profile} />}
        {tab === 'history' && <HistoryView goPlay={() => setTab('play')} />}
        {tab === 'ask' && <AskView />}
      </div>
      <TabBar tab={tab} setTab={setTab} />
    </main>
  )
}

/* ─────────────── 온보딩 ─────────────── */
function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState<AgeKey | null>(null)
  const [interests, setInterests] = useState<string[]>([])

  function toggleInterest(v: string) {
    setInterests((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    )
  }
  function start() {
    if (!age) return
    const p: Profile = { name: name.trim() || '우리 아이', age, interests }
    saveProfile(p)
    onDone(p)
  }

  return (
    <main className="min-h-screen bg-[#FBF7F0] text-stone-800">
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="text-center">
          <div className="text-4xl">🧸</div>
          <h1 className="mt-2 text-2xl font-extrabold text-stone-900">
            노리를 시작해요
          </h1>
          <p className="mt-2 text-stone-500">우리 아이를 알려주세요.</p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
          <p className="mb-2 text-sm font-medium text-stone-500">
            아이 이름(또는 애칭)
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 지우"
            className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-amber-400"
          />

          <p className="mb-2 mt-5 text-sm font-medium text-stone-500">몇 살이에요?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AGES.map((a) => (
              <Chip
                key={a.key}
                label={a.label}
                active={age === a.key}
                onClick={() => setAge(a.key)}
              />
            ))}
          </div>

          <p className="mb-2 mt-5 text-sm font-medium text-stone-500">
            요즘 좋아하는 것 <span className="text-stone-300">(여러 개)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((v) => (
              <Chip
                key={v}
                label={v}
                active={interests.includes(v)}
                onClick={() => toggleInterest(v)}
              />
            ))}
          </div>

          <button
            onClick={start}
            disabled={!age}
            className="mt-7 w-full rounded-2xl bg-amber-500 py-4 text-lg font-bold text-white transition active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400"
          >
            시작하기
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-stone-400">
          노리는 아이가 아니라, 부모를 위한 앱이에요.
        </p>
      </div>
    </main>
  )
}

/* ─────────────── 오늘의 놀이 ─────────────── */
function TodayView({ profile, goPlay }: { profile: Profile; goPlay: () => void }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setStreak(getStreak())
    const cached = getTodayCache()
    if (cached) {
      setRecipe(cached)
    } else {
      void loadToday()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadToday() {
    setLoading(true)
    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: profile.age,
          interests: profile.interests,
          situation: '오늘 하루 부담 없이 할 수 있는 놀이 하나 추천해줘.',
        }),
      })
      const data = await res.json()
      setRecipe(data.recipe)
      setTodayCache(data.recipe)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <header className="pt-2">
        <p className="text-sm text-stone-400">우리 아이 놀이 친구, 노리</p>
        <h1 className="mt-1 text-2xl font-extrabold text-stone-900">
          {profile.name}님, 오늘도 반가워요
        </h1>
        {streak > 0 && (
          <p className="mt-2 inline-block rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-500">
            🔥 {streak}일 연속 함께 놀았어요
          </p>
        )}
      </header>

      <p className="mt-6 mb-2 text-base font-semibold text-stone-800">
        오늘 {profile.name}이랑 이거 어때요?
      </p>

      {loading && !recipe ? (
        <div className="rounded-3xl bg-white p-8 text-center text-stone-400 shadow-sm ring-1 ring-stone-100">
          노리가 오늘의 놀이를 고르고 있어요…
        </div>
      ) : recipe ? (
        <RecipeCard recipe={recipe} onSaved={() => setStreak(getStreak())} />
      ) : null}

      <button
        onClick={loadToday}
        className="mt-4 w-full rounded-2xl bg-amber-50 py-3 font-semibold text-amber-700 active:scale-[0.98]"
      >
        다른 놀이 볼래요
      </button>

      <button
        onClick={goPlay}
        className="mt-3 w-full rounded-2xl border border-stone-200 bg-white py-3 font-semibold text-stone-600 active:scale-[0.98]"
      >
        지금 상황에 맞춰 만들기 →
      </button>
    </div>
  )
}

/* ─────────────── 지금 상황 맞춤 (생성기) ─────────────── */
function PlayView({ profile }: { profile: Profile }) {
  const [situation, setSituation] = useState('')
  const [mood, setMood] = useState<'calm' | 'active' | null>(null)
  const [mess, setMess] = useState<'clean' | 'messy' | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [listening, setListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [source, setSource] = useState<Source | null>(null)
  const recRef = useRef<{ start: () => void; stop: () => void } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR =
      (window as unknown as { SpeechRecognition?: new () => never })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => never })
        .webkitSpeechRecognition
    if (!SR) return
    setVoiceSupported(true)
    const rec = new SR() as unknown as {
      lang: string
      interimResults: boolean
      onresult: (e: unknown) => void
      onend: () => void
      onerror: () => void
      start: () => void
      stop: () => void
    }
    rec.lang = 'ko-KR'
    rec.interimResults = false
    rec.onresult = (e) => {
      const t = (e as { results?: Array<Array<{ transcript?: string }>> })
        .results?.[0]?.[0]?.transcript
      if (t) setSituation((prev) => (prev ? prev + ' ' : '') + t)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
  }, [])

  function toggleMic() {
    const rec = recRef.current
    if (!rec) return
    if (listening) {
      rec.stop()
      setListening(false)
    } else {
      setListening(true)
      rec.start()
    }
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  function toggle<T>(cur: T | null, val: T, set: (v: T | null) => void) {
    set(cur === val ? null : val)
  }

  async function callApi(excludeTitle?: string) {
    setLoading(true)
    if (!excludeTitle) setRecipe(null)
    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: profile.age,
          interests: profile.interests,
          situation: situation.trim(),
          mood,
          mess,
          imageBase64: image ?? undefined,
          excludeTitle,
        }),
      })
      const data = await res.json()
      setRecipe(data.recipe)
      setSource(data.source)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="pt-2 text-2xl font-extrabold text-stone-900">
        지금 뭐 하고 놀까요?
      </h1>
      <p className="mt-1 text-stone-500">
        상황을 말하거나, 방을 찍거나, 그냥 만들어달라고 해도 돼요.
      </p>

      <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={3}
          placeholder="예: 비 오는 날인데 애가 계속 칭얼대요. 집엔 페트병이랑 스카프밖에 없어요."
          className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-[15px] leading-relaxed outline-none placeholder:text-stone-300 focus:border-amber-400"
        />

        {/* 상태 프리셋 */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip label="😌 차분하게" active={mood === 'calm'} onClick={() => toggle(mood, 'calm', setMood)} />
          <Chip label="⚡ 기운 빼기" active={mood === 'active'} onClick={() => toggle(mood, 'active', setMood)} />
          <Chip label="🧼 안 흘리게" active={mess === 'clean'} onClick={() => toggle(mess, 'clean', setMess)} />
          <Chip label="🎨 맘껏" active={mess === 'messy'} onClick={() => toggle(mess, 'messy', setMess)} />
        </div>

        {/* 카메라 + 음성 */}
        <div className="mt-3 flex gap-2">
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-stone-200 py-3 font-medium text-stone-600 active:scale-[0.98]">
            📸 방 찍기
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onPickImage}
              className="hidden"
            />
          </label>
          {voiceSupported && (
            <button
              onClick={toggleMic}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl border py-3 font-medium active:scale-[0.98] ${
                listening
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-stone-200 text-stone-600'
              }`}
            >
              {listening ? '🔴 듣는 중…' : '🎤 말로'}
            </button>
          )}
        </div>

        {image && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-stone-50 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="방 사진" className="h-14 w-14 rounded-xl object-cover" />
            <span className="text-sm text-stone-500">사진을 보고 놀이를 만들어요</span>
            <button
              onClick={() => setImage(null)}
              className="ml-auto text-sm text-stone-400"
            >
              지우기
            </button>
          </div>
        )}

        <button
          onClick={() => callApi()}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-amber-500 py-4 text-lg font-bold text-white transition active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400"
        >
          {loading ? '노리가 생각하고 있어요…' : '놀이 만들어줘'}
        </button>
      </section>

      {recipe && !loading && (
        <div className="mt-6">
          <RecipeCard
            recipe={recipe}
            source={source}
            onAnother={() => callApi(recipe.title)}
          />
        </div>
      )}
    </div>
  )
}

/* ─────────────── 놀이 기록 (유대 타임라인) ─────────────── */
function HistoryView({ goPlay }: { goPlay: () => void }) {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setItems(getHistory())
    setStreak(getStreak())
  }, [])

  return (
    <div>
      <h1 className="pt-2 text-2xl font-extrabold text-stone-900">
        우리의 놀이 기록
      </h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-100">
          <div className="text-4xl">🌱</div>
          <p className="mt-3 text-stone-500">
            아직 함께한 놀이가 없어요.
            <br />
            첫 놀이를 시작해볼까요?
          </p>
          <button
            onClick={goPlay}
            className="mt-5 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-white active:scale-[0.98]"
          >
            놀이 만들러 가기
          </button>
        </div>
      ) : (
        <>
          <p className="mt-2 text-stone-500">
            {profileSummary(items.length, streak)}
          </p>
          <div className="mt-5 space-y-3">
            {items.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100"
              >
                <div className="text-2xl">{h.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-stone-800">
                    {h.title}
                  </p>
                  <p className="text-xs text-stone-400">{h.date}</p>
                </div>
                {h.domains && h.domains[0] && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    {h.domains[0]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function profileSummary(count: number, streak: number) {
  if (streak > 1) return `🔥 ${streak}일 연속, 지금까지 ${count}번 함께 놀았어요.`
  return `지금까지 ${count}번 함께 놀았어요.`
}

/* ─────────────── 무엇이든 묻기 (Q&A) ─────────────── */
function AskView() {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const examples = ['밤에 안 자려고 해요', '자꾸 물건을 던져요', '편식이 심해요']

  async function ask(question: string) {
    const text = question.trim()
    if (!text) return
    setQ(text)
    setLoading(true)
    setAnswer(null)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      })
      const data = await res.json()
      setAnswer(data.answer)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="pt-2 text-2xl font-extrabold text-stone-900">
        노리에게 물어보기
      </h1>
      <p className="mt-1 text-stone-500">놀이 말고도, 육아가 막막할 때요.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {examples.map((e) => (
          <button
            key={e}
            onClick={() => ask(e)}
            className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-500 active:scale-95"
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={2}
          placeholder="궁금한 걸 편하게 적어주세요."
          className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 outline-none placeholder:text-stone-300 focus:border-amber-400"
        />
        <button
          onClick={() => ask(q)}
          disabled={loading}
          className="mt-3 w-full rounded-2xl bg-amber-500 py-3 font-bold text-white active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400"
        >
          {loading ? '노리가 생각 중…' : '물어보기'}
        </button>
      </div>

      {answer && (
        <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-stone-700">
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 공용 컴포넌트 ─────────────── */
function RecipeCard({
  recipe,
  source,
  onAnother,
  onSaved,
}: {
  recipe: Recipe
  source?: Source | null
  onAnother?: () => void
  onSaved?: () => void
}) {
  const [saved, setSaved] = useState(false)

  function save() {
    addHistory(recipe)
    setSaved(true)
    onSaved?.()
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-amber-100">
      <div className="flex items-center justify-between">
        <div className="text-3xl">{recipe.emoji}</div>
        {source === 'ai' && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            실시간 AI 생성
          </span>
        )}
      </div>
      <h2 className="mt-2 text-xl font-bold text-stone-900">{recipe.title}</h2>
      {recipe.domains && recipe.domains.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {recipe.domains.map((d) => (
            <span
              key={d}
              className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
            >
              {d} 발달
            </span>
          ))}
        </div>
      )}
      <p className="mt-2 text-sm text-stone-400">준비물 · {recipe.prep}</p>

      <ol className="mt-4 space-y-2">
        {recipe.steps.map((s, idx) => (
          <li key={idx} className="flex gap-2.5 text-[15px] leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
              {idx + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <Block tone="rose" label="💬 이렇게 말 걸어요" text={recipe.talk} />
      <Block tone="green" label="🌱 이런 게 자라요" text={recipe.grow} />
      <Block tone="stone" label="⚠️ 안전" text={recipe.safety} />

      <div className="mt-5 flex gap-2">
        <button
          onClick={save}
          disabled={saved}
          className={`flex-1 rounded-2xl py-3 font-semibold transition active:scale-[0.98] ${
            saved
              ? 'bg-rose-50 text-rose-400'
              : 'bg-rose-500 text-white'
          }`}
        >
          {saved ? '기록했어요 ❤️' : '이거 했어요 ❤️'}
        </button>
        {onAnother && (
          <button
            onClick={onAnother}
            className="rounded-2xl bg-amber-50 px-5 py-3 font-semibold text-amber-700 active:scale-[0.98]"
          >
            다른 놀이
          </button>
        )}
      </div>
    </section>
  )
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { key: Tab; label: string; icon: string }[] = [
    { key: 'today', label: '오늘', icon: '🏠' },
    { key: 'play', label: '놀이 만들기', icon: '✨' },
    { key: 'history', label: '기록', icon: '❤️' },
    { key: 'ask', label: '물어보기', icon: '💬' },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-stone-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              tab === it.key ? 'text-amber-600' : 'text-stone-400'
            }`}
          >
            <span className="text-lg">{it.icon}</span>
            {it.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
        active
          ? 'border-amber-500 bg-amber-500 text-white'
          : 'border-stone-200 bg-white text-stone-600'
      }`}
    >
      {label}
    </button>
  )
}

function Block({
  label,
  text,
  tone,
}: {
  label: string
  text: string
  tone: 'rose' | 'green' | 'stone'
}) {
  const toneMap = {
    rose: 'bg-rose-50 text-rose-900',
    green: 'bg-emerald-50 text-emerald-900',
    stone: 'bg-stone-50 text-stone-600',
  }
  return (
    <div className={`mt-3 rounded-2xl px-4 py-3 ${toneMap[tone]}`}>
      <p className="text-xs font-bold opacity-70">{label}</p>
      <p className="mt-1 text-[15px] leading-relaxed">{text}</p>
    </div>
  )
}
