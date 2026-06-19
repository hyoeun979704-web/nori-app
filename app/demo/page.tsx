'use client'

import { useState } from 'react'
import {
  AGES,
  ITEMS,
  matchRecipes,
  anyRecipeForAge,
  type AgeKey,
  type ItemKey,
  type Recipe,
} from '@/lib/demo/recipes'

export default function DemoPage() {
  const [age, setAge] = useState<AgeKey | null>(null)
  const [item, setItem] = useState<ItemKey | null>(null)
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  const canGenerate = age !== null && item !== null

  function generate() {
    if (!age || !item) return
    setLoading(true)
    setRecipe(null)
    setTimeout(() => {
      const matches = matchRecipes(age, item)
      setRecipe(matches[0] ?? null)
      setLoading(false)
    }, 750)
  }

  function another() {
    if (!age) return
    setLoading(true)
    setTimeout(() => {
      setRecipe((prev) => anyRecipeForAge(age, prev?.title))
      setLoading(false)
    }, 600)
  }

  function reset() {
    setAge(null)
    setItem(null)
    setRecipe(null)
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
            “오늘 뭐 하고 놀지?” 하고 물으면,
            <br />
            지금 집에 있는 걸로 우리 아이한테
            <br />
            딱 맞는 놀이를 만들어줘요.
          </p>
        </header>

        {/* ── 터닝포인트: 직접 해보게 만드는 데모 ── */}
        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
          <p className="text-center text-base font-semibold text-stone-800">
            지금 한번 해볼까요?
          </p>

          {/* 나이 */}
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

          {/* 물건 */}
          <p className="mt-5 mb-2 text-sm font-medium text-stone-500">
            지금 집에 뭐가 있어요?
          </p>
          <div className="flex flex-wrap gap-2">
            {ITEMS.map((i) => (
              <Chip
                key={i.key}
                active={item === i.key}
                onClick={() => setItem(i.key)}
                label={`${i.emoji} ${i.label}`}
              />
            ))}
          </div>

          <button
            onClick={generate}
            disabled={!canGenerate || loading}
            className="mt-6 w-full rounded-2xl bg-amber-500 py-4 text-lg font-bold text-white transition active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400"
          >
            {loading ? '노리가 생각하고 있어요…' : '놀이 만들어줘'}
          </button>
        </section>

        {/* ── 결과: "뭘 할 수 있는데?"의 증거 ── */}
        {recipe && !loading && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-amber-100">
            <div className="text-3xl">{recipe.emoji}</div>
            <h2 className="mt-2 text-xl font-bold text-stone-900">
              {recipe.title}
            </h2>
            <p className="mt-1 text-sm text-stone-400">준비물 · {recipe.prep}</p>

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
                onClick={another}
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
              방금 노리가 우리 아이에 맞춰 만든 놀이예요.
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
