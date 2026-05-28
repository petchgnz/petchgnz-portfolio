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
import { useUpsertExperience } from '@/hooks/use-portfolio';
import type { Experience, EmploymentType, TeamworkType } from '@/types';

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'FULL_TIME',
  'PART_TIME',
  'FREELANCE',
  'CONTRACT',
];
const TEAMWORK_TYPES: TeamworkType[] = ['SOLO', 'TEAM'];

const schema = z.object({
  company: z.string().min(1, 'Required'),
  position: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT']),
  teamworkType: z.enum(['SOLO', 'TEAM']),
});

type FormValues = z.infer<typeof schema>;

// แปลง ISO date string → input[type=date] format (YYYY-MM-DD)
const toDateInput = (dateStr?: string): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<Experience>;
}

export function ExperienceEditSheet({
  open,
  onOpenChange,
  defaultValues,
}: Props) {
  const mutation = useUpsertExperience();

  const getDefaults = (): FormValues => ({
    company: defaultValues?.company ?? '',
    position: defaultValues?.position ?? '',
    description: defaultValues?.description ?? '',
    startDate: toDateInput(defaultValues?.startDate),
    endDate: toDateInput(defaultValues?.endDate),
    employmentType:
      (defaultValues?.employmentType as EmploymentType) ?? 'FULL_TIME',
    teamworkType: (defaultValues?.teamworkType as TeamworkType) ?? 'TEAM',
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaults(),
  });

  useEffect(() => {
    reset(getDefaults());
  }, [defaultValues, reset]);

  const onSubmit = (values: FormValues): void => {
    mutation.mutate(
      { ...values, id: defaultValues?.id },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const isEditing = !!defaultValues?.id;

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
          <SheetTitle>
            {isEditing ? 'Edit Experience' : 'Add Experience'}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-6 space-y-4'
        >
          {(['company', 'position'] as const).map((name) => (
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

          <Controller
            name='description'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='description'>Description</FieldLabel>
                <Textarea
                  {...field}
                  id='description'
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {(['startDate', 'endDate'] as const).map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name}>
                    {name === 'startDate' ?
                      'Start Date'
                    : 'End Date (leave empty if current)'}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={name}
                    type='date'
                    value={field.value ?? ''}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ))}

          {/* Employment Type */}
          <Controller
            name='employmentType'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='employmentType'>
                  Employment Type
                </FieldLabel>
                <select
                  {...field}
                  id='employmentType'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option
                      key={t}
                      value={t}
                    >
                      {t
                        .replace('_', '-')
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          />

          {/* Teamwork Type */}
          <Controller
            name='teamworkType'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='teamworkType'>Teamwork Type</FieldLabel>
                <select
                  {...field}
                  id='teamworkType'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                >
                  {TEAMWORK_TYPES.map((t) => (
                    <option
                      key={t}
                      value={t}
                    >
                      {typeof t === 'string' && t.length > 0 ?
                        t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
                      : String(t)}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          />

          <Button
            type='submit'
            className='w-full'
            disabled={mutation.isPending}
          >
            {mutation.isPending ?
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            : isEditing ?
              'Save changes'
            : 'Add experience'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
