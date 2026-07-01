import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChildForm } from '@/components/child-form'
import { createClient } from '@/lib/supabase/server'
import { updateChild, deleteChild } from '@/app/children/actions'

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ error?: string }>

export default async function EditChildPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { id } = await params
  const { error } = await searchParams

  const supabase = await createClient()
  const { data: child } = await supabase
    .from('children')
    .select('*')
    .eq('id', id)
    .single()

  if (!child) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/children">← 우리 아이들</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{child.name} 정보 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <ChildForm
            action={updateChild}
            submitLabel="저장하기"
            error={error}
            defaultValues={{
              id: child.id,
              name: child.name,
              birth_date: child.birth_date,
              interests: child.interests,
              notes: child.notes ?? undefined,
            }}
          />

          <form action={deleteChild} className="mt-8 border-t pt-6">
            <input type="hidden" name="id" value={child.id} />
            <Button
              type="submit"
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
            >
              이 아이 프로필 삭제
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              삭제하면 되돌릴 수 없어요.
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
