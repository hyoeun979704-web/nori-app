'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { INTEREST_OPTIONS } from '@/lib/interests'

export type ChildFormValues = {
  id?: string
  name?: string
  birth_date?: string
  interests?: string[]
  notes?: string
}

type ChildFormProps = {
  action: (formData: FormData) => void | Promise<void>
  defaultValues?: ChildFormValues
  submitLabel: string
  error?: string
}

export function ChildForm({
  action,
  defaultValues,
  submitLabel,
  error,
}: ChildFormProps) {
  const [interests, setInterests] = useState<string[]>(
    defaultValues?.interests ?? [],
  )

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    )
  }

  // 만 8세 이하만 입력 가능 — date input의 min/max를 동적으로 계산
  const today = new Date()
  const max = today.toISOString().slice(0, 10)
  const minDate = new Date(today)
  minDate.setFullYear(minDate.getFullYear() - 8)
  const min = minDate.toISOString().slice(0, 10)

  return (
    <form action={action} className="space-y-6">
      {defaultValues?.id ? (
        <input type="hidden" name="id" value={defaultValues.id} />
      ) : null}
      <input type="hidden" name="interests" value={JSON.stringify(interests)} />

      <div className="space-y-2">
        <Label htmlFor="name">아이 애칭</Label>
        <Input
          id="name"
          name="name"
          maxLength={20}
          required
          placeholder="예: 콩이"
          defaultValue={defaultValues?.name}
        />
        <p className="text-xs text-muted-foreground">
          노리가 아이를 부를 이름이에요. 별명도 좋아요.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">생년월일</Label>
        <Input
          id="birth_date"
          name="birth_date"
          type="date"
          required
          min={min}
          max={max}
          defaultValue={defaultValues?.birth_date}
        />
        <p className="text-xs text-muted-foreground">
          또래와 비교하지 않아요. 지금 우리 아이에게 맞는 놀이를 찾는 데만
          써요.
        </p>
      </div>

      <div className="space-y-2">
        <Label>요즘 좋아하는 것 (여러 개 선택 가능)</Label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((option) => {
            const selected = interests.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleInterest(option)}
                aria-pressed={selected}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition-colors',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground hover:bg-accent',
                )}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">특이사항 (선택)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="알레르기, 좋아하는 놀이 방식 등 노리가 알면 좋을 점을 적어주세요."
          defaultValue={defaultValues?.notes}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  )
}
