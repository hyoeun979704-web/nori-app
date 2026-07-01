// next/headers를 사용하므로 이 모듈은 서버에서만 임포트된다.
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export type Child = {
  id: string
  user_id: string
  name: string
  birth_date: string
  interests: string[]
  notes: string | null
  created_at: string
  updated_at: string
}

const ACTIVE_CHILD_COOKIE = 'nori_active_child'

/** 로그인한 사용자의 자녀 목록을 등록순으로 반환한다. (RLS로 본인 것만 조회됨) */
export async function getChildren(): Promise<Child[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getChildren failed:', error.message)
    return []
  }
  return data ?? []
}

/**
 * 현재 활성 자녀를 반환한다. 쿠키에 저장된 id를 우선하고,
 * 없거나 유효하지 않으면 첫 번째 자녀로 폴백한다.
 */
export async function getActiveChild(): Promise<Child | null> {
  const children = await getChildren()
  if (children.length === 0) return null

  const cookieStore = await cookies()
  const activeId = cookieStore.get(ACTIVE_CHILD_COOKIE)?.value
  const matched = children.find((c) => c.id === activeId)
  return matched ?? children[0] ?? null
}

export { ACTIVE_CHILD_COOKIE }
