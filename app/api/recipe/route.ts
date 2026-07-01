import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import {
  matchRecipes,
  anyRecipeForAge,
  inferItem,
  AGES,
  ITEMS,
  type AgeKey,
  type ItemKey,
} from '@/lib/demo/recipes'

// 노리의 핵심 자산: "파인튜닝"이 아니라 이 프롬프트 설계가 성능을 만든다.
// 안전 하드 제약(연령별 삼킴·질식 위험) + 발달 적합성 + 부모 상호작용 + 형식 고정.
const SYSTEM = `너는 0~5세 영유아 놀이 전문가이자 아동 안전 전문가야.
부모가 지금 집에서 아이와 바로 할 수 있는 놀이 딱 하나를 제안해.

[발달 적합성]
- 주어진 연령의 발달 단계에 정확히 맞춰라(돌 전: 감각·애착·대상영속성 / 1~2세: 소근육·언어폭발·따라하기 / 3~4세: 상상·역할·규칙 / 5세+: 협력·서사·문제해결).
- "세련된" 놀이보다 그 나이 아이가 실제로 즐기고 반응하는 놀이가 좋다. 어린 아이일수록 단순·물리적으로.

[안전 — 절대 규칙]
- 이물질 삼킴 사고는 1세 전후가 가장 많다. 돌 전·1~2세에게는 작은 부품, 구슬, 자석, 동전, 단추, 스티커, 건전지, 끈, 비닐봉지, 물(익사), 높은 곳을 절대 제안하지 마라.
- 3세 이상도 가위 등 도구는 "보호자와 함께"를 전제로만.
- 어떤 놀이든 보호자 감독 하에 안전하게 가능해야 한다.
- 의학적 진단·발달 평가·치료 조언은 하지 마라.

[부모-아이 유대]
- 눈맞춤, 함께 웃기, 스킨십, 주고받는 상호작용을 놀이 안에 녹여라.
- 부모가 아이에게 건넬 구체적인 말 한마디(talk)를 반드시 포함해 언어 자극을 돕는다.

[형식]
- 준비물은 부모가 말한 물건 + 어느 집에나 있는 흔한 물건을 전제로.
- 순서(steps)는 3단계, 짧고 명확하게.
- 진부하지 않게, 부모가 "오 이거 해볼까" 싶게.
- 한국어로, 따뜻하고 다정한 말투로.`

const RECIPE_SCHEMA = {
  type: 'object',
  properties: {
    emoji: { type: 'string', description: '놀이를 상징하는 이모지 1개' },
    title: { type: 'string' },
    prep: { type: 'string', description: '준비물 (없으면 "준비물 없음")' },
    steps: {
      type: 'array',
      items: { type: 'string' },
      description: '놀이 순서 3단계',
    },
    talk: { type: 'string', description: '부모가 아이에게 건네는 말 한마디' },
    grow: { type: 'string', description: '이 놀이로 자라는 발달 영역 설명' },
    safety: { type: 'string', description: '연령에 맞는 안전 고지' },
  },
  required: ['emoji', 'title', 'prep', 'steps', 'talk', 'grow', 'safety'],
  additionalProperties: false,
}

export async function POST(req: Request) {
  const body = await req.json()
  const age = body.age as AgeKey
  const voiceText = (body.voiceText as string | undefined)?.trim()
  const excludeTitle = body.excludeTitle as string | undefined
  // 물건: 칩 선택값 우선, 없으면 음성에서 추정
  const item = (body.item as ItemKey | undefined) ??
    (voiceText ? inferItem(voiceText) : 'none')

  const key = process.env.ANTHROPIC_API_KEY

  // 키가 없으면 시연은 계속되도록 샘플로 폴백
  if (!key) {
    const sample = excludeTitle
      ? anyRecipeForAge(age, excludeTitle)
      : matchRecipes(age, item)[0]
    return NextResponse.json({ recipe: sample, source: 'sample' })
  }

  const ageLabel = AGES.find((a) => a.key === age)?.label ?? '영유아'
  const itemLabel = ITEMS.find((i) => i.key === item)?.label ?? '집에 있는 물건'
  const userMsg = [
    `아이 나이: ${ageLabel}`,
    `집에 있는 것: ${itemLabel}`,
    voiceText ? `부모가 한 말: "${voiceText}"` : '',
    excludeTitle ? `단, "${excludeTitle}"와는 다른 새로운 놀이로 제안해줘.` : '',
    '이 조건으로 놀이 하나를 제안해줘.',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const client = new Anthropic({ apiKey: key })
    // output_config는 SDK 버전에 따라 타입이 없을 수 있어 느슨하게 전달
    const params: Record<string, unknown> = {
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM,
      output_config: { format: { type: 'json_schema', schema: RECIPE_SCHEMA } },
      messages: [{ role: 'user', content: userMsg }],
    }
    const res = await client.messages.create(params as never)
    const text =
      (res as { content: { type: string; text?: string }[] }).content.find(
        (b) => b.type === 'text',
      )?.text ?? '{}'
    const recipe = JSON.parse(text)
    return NextResponse.json({ recipe, source: 'ai' })
  } catch {
    // API 실패 시에도 시연이 끊기지 않게 샘플 폴백
    const sample = matchRecipes(age, item)[0]
    return NextResponse.json({ recipe: sample, source: 'sample-fallback' })
  }
}
