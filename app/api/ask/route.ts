import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// 무엇이든 묻기 (Lovevery "Ask" 차용) — 육아 Q&A
const SYSTEM = `너는 0~5세 영유아 부모를 돕는 따뜻한 육아 상담 도우미야.
- 부모의 질문에 공감하고, 실용적이고 구체적인 조언을 한국어로 다정하게 해줘.
- 발달·놀이·훈육·수면·식사 등 일상 육아 질문에 답한다.
- 절대 하지 말 것: 의학적 진단, 약 처방, 특정 질환 단정.
- 발달 지연·건강 이상 신호가 의심되면, 추측하지 말고 "소아과나 전문가와 상담"을 권한다.
- "비교하지 않기": 다른 아이·평균과 비교해 불안을 주지 말고, 그 아이의 지금에 집중한다.
- 3~5문장으로 간결하게.`

export async function POST(req: Request) {
  const { question } = await req.json()
  const q = (question as string | undefined)?.trim()
  if (!q) {
    return NextResponse.json({ answer: '궁금한 걸 적어주세요 :)', source: 'none' })
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return NextResponse.json({
      answer:
        '지금은 샘플 모드예요. 실제 답변은 ANTHROPIC_API_KEY를 넣으면 노리가 직접 답해드려요. (예: "밤에 안 자려고 해요" 같은 질문에 맞춤 조언을 드립니다.)',
      source: 'sample',
    })
  }

  try {
    const client = new Anthropic({ apiKey: key })
    const params: Record<string, unknown> = {
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: SYSTEM,
      messages: [{ role: 'user', content: q }],
    }
    const res = await client.messages.create(params as never)
    const answer =
      (res as { content: { type: string; text?: string }[] }).content.find(
        (b) => b.type === 'text',
      )?.text ?? '잠시 후 다시 시도해 주세요.'
    return NextResponse.json({ answer, source: 'ai' })
  } catch {
    return NextResponse.json({
      answer: '지금은 답변을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
      source: 'error',
    })
  }
}
