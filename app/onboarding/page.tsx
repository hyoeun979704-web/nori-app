import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChildForm } from '@/components/child-form'
import { createChild } from '@/app/children/actions'

type SearchParams = Promise<{ error?: string }>

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { error } = await searchParams

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>우리 아이를 소개해 주세요</CardTitle>
          <CardDescription>
            아이 정보를 바탕으로 노리가 딱 맞는 놀이를 추천해요. 입력한 정보는
            나만 볼 수 있어요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChildForm
            action={createChild}
            submitLabel="노리 시작하기"
            error={error}
          />
        </CardContent>
      </Card>
    </main>
  )
}
