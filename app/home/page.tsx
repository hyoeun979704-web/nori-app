import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getChildren, getActiveChild } from '@/lib/children'
import { formatAge } from '@/lib/age'
import { setActiveChild } from '@/app/children/actions'

export default async function HomePage() {
  const [children, active] = await Promise.all([
    getChildren(),
    getActiveChild(),
  ])

  // 아직 등록한 아이가 없으면 온보딩으로 보낸다.
  if (children.length === 0 || !active) {
    redirect('/onboarding')
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {active.name}와 놀 시간이에요
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatAge(active.birth_date)}
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="outline" size="sm">
            로그아웃
          </Button>
        </form>
      </header>

      {/* 다자녀: 활성 자녀 전환 */}
      {children.length > 1 ? (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {children.map((child) => {
            const isActive = child.id === active.id
            return isActive ? (
              <span
                key={child.id}
                className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
              >
                {child.name}
              </span>
            ) : (
              <form key={child.id} action={setActiveChild}>
                <input type="hidden" name="id" value={child.id} />
                <button
                  type="submit"
                  className="rounded-full border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
                >
                  {child.name}
                </button>
              </form>
            )
          })}
        </div>
      ) : null}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>오늘은 뭐 하고 놀까요?</CardTitle>
          <CardDescription>
            {active.name}에게 맞는 놀이를 노리에게 물어보세요. 음성으로도 물어볼
            수 있어요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" disabled>
            노리에게 물어보기 (곧 만나요)
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            대화·음성 기능은 다음 업데이트에서 열려요.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild variant="ghost" size="sm">
          <Link href="/children">우리 아이들 관리</Link>
        </Button>
      </div>
    </main>
  )
}
