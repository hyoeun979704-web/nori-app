import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 정적 자산과 이미지 확장자, favicon을 제외한 모든 경로에 대해 실행한다.
     * Supabase 세션 쿠키 갱신과 보호 라우트 가드가 모든 네비게이션에서 동작해야 함.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
