import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            오늘도 반가워요!
          </h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="outline" size="sm">
            로그아웃
          </Button>
        </form>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>노리 MVP 준비 중</CardTitle>
          <CardDescription>
            Phase 2에서 자녀 프로필과 홈 대시보드를, Phase 3에서 음성 입력과
            채팅 UI를 채워 나갑니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          지금은 로그인만 완료된 상태예요. 다음 단계에서 우리 아이 정보를
          입력하고 첫 놀이를 추천받을 수 있어요.
        </CardContent>
      </Card>
    </main>
  )
}
