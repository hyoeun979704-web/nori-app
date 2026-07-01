import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getChildren, getActiveChild } from '@/lib/children'
import { formatAge } from '@/lib/age'
import { setActiveChild } from './actions'

export default async function ChildrenPage() {
  const [children, active] = await Promise.all([
    getChildren(),
    getActiveChild(),
  ])

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">우리 아이들</h1>
          <p className="text-sm text-muted-foreground">
            프로필을 관리하고, 노리와 놀 아이를 선택해요.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/onboarding">+ 아이 추가</Link>
        </Button>
      </header>

      <div className="space-y-4">
        {children.map((child) => {
          const isActive = child.id === active?.id
          return (
            <Card key={child.id} className={isActive ? 'border-primary' : undefined}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {child.name}
                    {isActive ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        선택됨
                      </span>
                    ) : null}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatAge(child.birth_date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isActive ? (
                    <form action={setActiveChild}>
                      <input type="hidden" name="id" value={child.id} />
                      <Button type="submit" variant="outline" size="sm">
                        선택
                      </Button>
                    </form>
                  ) : null}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/children/${child.id}/edit`}>수정</Link>
                  </Button>
                </div>
              </CardHeader>
              {child.interests.length > 0 ? (
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {child.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </CardContent>
              ) : null}
            </Card>
          )
        })}
      </div>

      {children.length > 1 ? (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          아이를 삭제하려면 수정 화면에서 진행할 수 있어요.
        </p>
      ) : null}
    </main>
  )
}
