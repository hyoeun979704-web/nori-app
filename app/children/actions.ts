'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ACTIVE_CHILD_COOKIE } from '@/lib/children'
import { isValidBirthDate } from '@/lib/age'
import { isValidInterest } from '@/lib/interests'

const COOKIE_OPTS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax' as const,
}

type ParsedForm = {
  name: string
  birth_date: string
  interests: string[]
  notes: string | null
  error?: string
}

function parseChildForm(formData: FormData): ParsedForm {
  const name = String(formData.get('name') ?? '').trim()
  const birth_date = String(formData.get('birth_date') ?? '').trim()
  const notesRaw = String(formData.get('notes') ?? '').trim()

  let interests: string[] = []
  try {
    const parsed = JSON.parse(String(formData.get('interests') ?? '[]'))
    if (Array.isArray(parsed)) {
      interests = parsed.filter(
        (v): v is string => typeof v === 'string' && isValidInterest(v),
      )
    }
  } catch {
    interests = []
  }

  const base = { name, birth_date, interests, notes: notesRaw || null }

  if (name.length < 1 || name.length > 20) {
    return { ...base, error: '아이 애칭은 1~20자로 입력해 주세요.' }
  }
  if (!isValidBirthDate(birth_date)) {
    return { ...base, error: '생년월일을 다시 확인해 주세요. (만 8세 이하)' }
  }
  return base
}

/** 온보딩/추가 등록에서 호출. 성공 시 새 자녀를 활성으로 지정하고 홈으로 이동. */
export async function createChild(formData: FormData) {
  const parsed = parseChildForm(formData)
  if (parsed.error) {
    redirect(`/onboarding?error=${encodeURIComponent(parsed.error)}`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('children')
    .insert({
      user_id: user.id,
      name: parsed.name,
      birth_date: parsed.birth_date,
      interests: parsed.interests,
      notes: parsed.notes,
    })
    .select('id')
    .single()

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent('등록 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.')}`)
  }

  const cookieStore = await cookies()
  cookieStore.set(ACTIVE_CHILD_COOKIE, data.id, COOKIE_OPTS)

  revalidatePath('/', 'layout')
  redirect('/home')
}

/** 자녀 정보 수정. 성공 시 자녀 관리 페이지로 복귀. */
export async function updateChild(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const parsed = parseChildForm(formData)
  if (parsed.error) {
    redirect(`/children/${id}/edit?error=${encodeURIComponent(parsed.error)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('children')
    .update({
      name: parsed.name,
      birth_date: parsed.birth_date,
      interests: parsed.interests,
      notes: parsed.notes,
    })
    .eq('id', id)

  if (error) {
    redirect(`/children/${id}/edit?error=${encodeURIComponent('수정 중 문제가 생겼어요.')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/children')
}

export async function deleteChild(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const supabase = await createClient()
  await supabase.from('children').delete().eq('id', id)

  revalidatePath('/', 'layout')
  redirect('/children')
}

/** 홈/관리 화면에서 활성 자녀 전환. */
export async function setActiveChild(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const cookieStore = await cookies()
  cookieStore.set(ACTIVE_CHILD_COOKIE, id, COOKIE_OPTS)
  revalidatePath('/', 'layout')
}
