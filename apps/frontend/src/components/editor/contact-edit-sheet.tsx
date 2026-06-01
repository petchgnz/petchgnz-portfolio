'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import type { ContactSection } from '@/types'

const schema = z.object({
  email:    z.string().email('Invalid email'),
  github:   z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues: ContactSection
  onSubmit: (values: FormValues) => void
  isPending: boolean
}

export function ContactEditSheet({
  open, onOpenChange, defaultValues, onSubmit, isPending,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto px-5" showCloseButton={false}>
        <SheetHeader className='text-center'>
          <SheetTitle className='text-3xl'>Edit Contact</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {(['email', 'github', 'linkedin'] as const).map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name} className="capitalize">{name}</FieldLabel>
                  <Input
                    {...field}
                    id={name}
                    value={field.value ?? ''}
                    placeholder={name === 'email' ? 'you@email.com' : 'https://...'}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}

          <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
            {isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              : 'Save changes'
            }
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}