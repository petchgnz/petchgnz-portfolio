'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import type { SkillSection } from '@/types';

const schema = z.object({
  // description:  z.string().min(10, 'At least 10 characters'),
  // location:     z.string().min(1, 'Required'),
  // availability: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  level: z.string().min(1, 'Required'),
  category: z.string().min(1, 'Required'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: SkillSection;
  onSubmit: (values: FormValues) => void;
  isPending: boolean;
}

export function SkillEditSheet({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const isEditing = !!defaultValues?.id;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        className='overflow-y-auto px-5'
        showCloseButton={false}
      >
        <SheetHeader className='text-center'>
          <SheetTitle className='text-3xl'>{isEditing ? 'Edit Skill' : 'Add Skill'}</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-6 space-y-4'
        >
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='description'>Name</FieldLabel>
                <Textarea
                  {...field}
                  id='description'
                  rows={5}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {(['level', 'category'] as const).map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={name}
                    className='capitalize'
                  >
                    {name}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={name}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ))}

          <Button
            type='submit'
            className='w-full cursor-pointer'
            disabled={isPending}
          >
            {isPending ?
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            : 'Save changes'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
