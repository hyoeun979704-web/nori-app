import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signup } from './actions'

type SearchParams = Promise<{ error?: string; sent?: string; email?: string }>

export default async function SignupPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { error, sent, email } = await searchParams

  if (sent === '1') {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle>이메일을 확인해주세요</CardTitle>
            <CardDescription>
              {email ? `${email}로 ` : ''}인증 메일을 보냈어요. 메일의 링크를
              눌러 가입을 완료해 주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              메일이 보이지 않는다면 스팸함도 확인해 주세요. 링크는 일정 시간이
              지나면 만료됩니다.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">로그인 화면으로 이동</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle>회원가입</CardTitle>
          <CardDescription>
            우리 아이를 위한 놀이 친구, 노리를 시작해요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                8자 이상으로 설정해 주세요.
              </p>
            </div>
            {error ? (
              <p
                className="text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full">
              가입하기
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            이미 계정이 있나요?{' '}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
