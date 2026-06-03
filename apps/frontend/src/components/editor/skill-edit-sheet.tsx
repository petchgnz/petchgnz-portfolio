'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import type { SkillCategory, SkillLevel, SkillSection } from '@/types';
import { useUpsertSkill } from '@/hooks/use-portfolio';

const LEVEL: SkillLevel[] = ['BEGINNER', 'INTERMEDIATED', 'ADVANCE', 'EXPERT'];
const CATEGORY: SkillCategory[] = ['FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS'];

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
  // onSubmit,
  isPending,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const mutation = useUpsertSkill();
  const isEditing = !!defaultValues?.id;

  const onSubmit = (values: FormValues) => {
    console.log(values)

    const payload = {
      ...values,
      id: defaultValues?.id,
      name: values.name || null,
      level: values.level || null,
      category: values.category || null,
    };

    mutation.mutate(
      // { ...values, id: defaultValues?.id },
      payload,
      { onSuccess: () => onOpenChange(false) },
    );

  }

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
          <SheetTitle className='text-3xl'>
            {isEditing ? 'Edit Skill' : 'Add Skill'}
          </SheetTitle>
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

          {(['level'] as const).map((name) => (
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
                  {/* <Input
                    {...field}
                    id={name}
                    aria-invalid={fieldState.invalid}
                  /> */}
                  <select
                    {...field}
                    id='level'
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  >
                    {LEVEL.map((level) => (
                      <option
                        value={level}
                        key={level}
                      >
                        {level}
                      </option>
                    ))}
                  </select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ))}

          {(['category'] as const).map((name) => (
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
                  {/* <Input
                    {...field}
                    id={name}
                    aria-invalid={fieldState.invalid}
                  /> */}
                  <select
                    {...field}
                    id='level'
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  >
                    {CATEGORY.map((cat) => (
                      <option
                        value={cat}
                        key={cat}
                      >
                        {cat}
                      </option>
                    ))}
                  </select>
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
