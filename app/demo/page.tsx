'use client'

import { useEffect, useRef, useState } from 'react'
import { AGES, type AgeKey, type Recipe } from '@/lib/demo/recipes'

type Source = 'ai' | 'sample' | 'sample-fallback'

// 빈칸 부담을 더는 예시 버튼 (누르면 자유서술에 덧붙는다)
const QUICK = ['수건', '종이컵', '양말', '휴지심', '박스', '빨래집게', '맨몸']

export default function DemoPage() {
  const [age, setAge] = useState<AgeKey | null>(null)
  const [situation, setSituation] = useState('')
  const [mood, setMood] = useState<'calm' | 'active' | null>(null)
  const [mess, setMess] = useState<'clean' | 'messy' | null>(null)
  const [listening, setListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [source, setSource] = useState<Source | null>(null)

  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(
    null,
  )

  // Web Speech API (브라우저 내장 STT) — 백엔드 없이 음성 입력
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
      maxAlternatives: number
      start: () => void
      stop: () => void
      onresult: (e: unknown) => void
      onend: () => void
      onerror: () => void
    }
    rec.lang = 'ko-KR'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const transcript = (
        e as { results?: Array<Array<{ transcript?: string }>> }
      ).results?.[0]?.[0]?.transcript
      if (transcript) {
        setSituation((prev) => (prev ? prev + ' ' : '') + transcript)
      }
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
  }, [])

  function toggleMic() {
    const rec = recognitionRef.current
    if (!rec) return
    if (listening) {
      rec.stop()
      setListening(false)
    } else {
      setListening(true)
      rec.start()
    }
  }

  function addQuick(word: string) {
    setSituation((prev) => (prev ? prev + ' ' + word : word))
  }

  const canGenerate = age !== null && situation.trim() !== ''

  async function callApi(excludeTitle?: string) {
    if (!age) return
    setLoading(true)
    if (!excludeTitle) setRecipe(null)
    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age,
          situation: situation.trim(),
          mood,
          mess,
          excludeTitle,
        }),
      })
      const data = await res.json()
      setRecipe(data.recipe)
      setSource(data.source)
    } catch {
      setRecipe(null)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setAge(null)
    setSituation('')
    setMood(null)
    setMess(null)
    setRecipe(null)
    setSource(null)
  }

  function toggle<T>(cur: T | null, val: T, set: (v: T | null) => void) {
    set(cur === val ? null : val)
  }

  return (
    <main className="min-h-screen bg-[#FBF7F0] text-stone-800">
      <div className="mx-auto max-w-md px-5 pb-24 pt-10">
        {/* ── 정체성: 이름 → 무엇 → 무엇을 해주는지 ── */}
        <header className="text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
            🧸 우리 아이 놀이 친구
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">
            노리
          </h1>
          <p className="mx-auto mt-4 max-w-xs text-lg leading-relaxed text-stone-600">
            지금 우리 집 상황을 말하면,
            <br />
            우리 아이한테 딱 맞는 놀이를
            <br />
            그 자리에서 만들어줘요.
          </p>
        </header>

        {/* ── 터닝포인트: 자유서술 → 즉석 놀이 ── */}
        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
          <p className="text-center text-base font-semibold text-stone-800">
            지금 한번 해볼까요?
          </p>

          {/* 나이 (안전·발달 기준) */}
          <p className="mt-6 mb-2 text-sm font-medium text-stone-500">
            우리 아이는 몇 살이에요?
          </p>
          <div className="flex flex-wrap gap-2">
            {AGES.map((a) => (
              <Chip
                key={a.key}
                active={age === a.key}
                onClick={() => setAge(a.key)}
                label={a.label}
              />
            ))}
          </div>

          {/* 자유서술: 상황·재료·아이 상태 무엇이든 */}
          <p className="mt-5 mb-2 text-sm font-medium text-stone-500">
            지금 상황을 편하게 말해주세요
          </p>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={3}
            placeholder="예: 비 오는 날인데 애가 계속 칭얼대요. 집엔 페트병이랑 스카프밖에 없어요."
            className="w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[15px] leading-relaxed text-stone-700 outline-none placeholder:text-stone-300 focus:border-amber-400"
          />

          {/* 예시 버튼 (빈칸 부담 완화) */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK.map((w) => (
              <button
                key={w}
                onClick={() => addQuick(w)}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-500 active:scale-95"
              >
                + {w}
              </button>
            ))}
          </div>

          {/* 실시간 상태 프리셋 (선택) */}
          <p className="mt-5 mb-2 text-sm font-medium text-stone-500">
            지금 아이 상태는요?{' '}
            <span className="text-stone-300">(선택)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Chip
              label="😌 차분하게"
              active={mood === 'calm'}
              onClick={() => toggle(mood, 'calm', setMood)}
            />
            <Chip
              label="⚡ 기운 빼기"
              active={mood === 'active'}
              onClick={() => toggle(mood, 'active', setMood)}
            />
            <Chip
              label="🧼 안 흘리게"
              active={mess === 'clean'}
              onClick={() => toggle(mess, 'clean', setMess)}
            />
            <Chip
              label="🎨 맘껏 어질러도"
              active={mess === 'messy'}
              onClick={() => toggle(mess, 'messy', setMess)}
            />
          </div>

          {/* 음성 입력 */}
          {voiceSupported && (
            <button
              onClick={toggleMic}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 font-medium transition active:scale-[0.98] ${
                listening
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-stone-200 bg-white text-stone-600'
              }`}
            >
              {listening ? '🔴 듣고 있어요… (다시 눌러 멈춤)' : '🎤 말로 하기'}
            </button>
          )}

          <button
            onClick={() => callApi()}
            disabled={!canGenerate || loading}
            className="mt-4 w-full rounded-2xl bg-amber-500 py-4 text-lg font-bold text-white transition active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400"
          >
            {loading ? '노리가 생각하고 있어요…' : '놀이 만들어줘'}
          </button>
        </section>

        {/* ── 결과: "뭘 할 수 있는데?"의 증거 ── */}
        {recipe && !loading && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-amber-100">
            <div className="flex items-center justify-between">
              <div className="text-3xl">{recipe.emoji}</div>
              {source === 'ai' && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  실시간 AI 생성
                </span>
              )}
            </div>
            <h2 className="mt-2 text-xl font-bold text-stone-900">
              {recipe.title}
            </h2>
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
                <li
                  key={idx}
                  className="flex gap-2.5 text-[15px] leading-relaxed"
                >
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
                onClick={() => callApi(recipe.title)}
                className="flex-1 rounded-2xl bg-amber-50 py-3 font-semibold text-amber-700 transition active:scale-[0.98]"
              >
                다른 놀이
              </button>
              <button
                onClick={reset}
                className="rounded-2xl bg-stone-100 px-5 py-3 font-semibold text-stone-500 transition active:scale-[0.98]"
              >
                처음부터
              </button>
            </div>

            <p className="mt-5 text-center text-sm leading-relaxed text-stone-400">
              방금 노리가 지금 상황에 맞춰 만든 놀이예요.
              <br />
              매일, 집에 있는 것만으로요.
            </p>
          </section>
        )}

        {/* ── 마무리 ── */}
        <footer className="mt-12 text-center">
          <p className="text-base font-bold text-stone-700">
            스크린 끄고, 노리 켜고.
          </p>
          <p className="mt-1 text-sm text-stone-400">
            누구나 부모는 처음이니까요.
          </p>
          <p className="mt-4 text-xs text-stone-300">
            노리는 아이가 아니라, 부모를 위한 앱이에요.
          </p>
        </footer>
      </div>
    </main>
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
