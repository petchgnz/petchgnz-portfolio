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
import { useSkills, useUpsertProject } from '@/hooks/use-portfolio';
import type { Project, ProjectType } from '@/types';

const PROJECT_TYPES: ProjectType[] = ['WEB', 'MOBILE', 'GAME', 'OTHER'];

const schema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  type: z.enum(['WEB', 'MOBILE', 'GAME', 'OTHER']),
  skillIds: z.array(z.string()).default([]),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<Project>;
}

export function ProjectEditSheet({ open, onOpenChange, defaultValues }: Props) {
  const mutation = useUpsertProject();

  const { data: skills } = useSkills();

  const getDefaults = (): FormValues => ({
    title: defaultValues?.title ?? '',
    description: defaultValues?.description ?? '',
    type: (defaultValues?.type as ProjectType) ?? 'WEB',
    skillIds: defaultValues?.skills?.map((skill) => skill.skillId) ?? [],
    githubUrl: defaultValues?.githubUrl ?? '',
    liveUrl: defaultValues?.liveUrl ?? '',
    imageUrl: defaultValues?.imageUrl ?? '',
  });

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaults(),
  });

  const selectedSkillIds = watch('skillIds');

  useEffect(() => {
    reset(getDefaults());
  }, [defaultValues, reset]);

  const onSubmit = (values: FormValues): void => {
    console.log(values)

    const payload = {
      ...values,
      id: defaultValues?.id,
      githubUrl: values.githubUrl || null,
      liveUrl: values.liveUrl || null,
      imageUrl: values.imageUrl || null,
    };

    mutation.mutate(
      // { ...values, id: defaultValues?.id },
      payload,
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const isEditing = !!defaultValues?.id;

  const toggleSkill = (skillId: string) => {
    const currentSkillId = selectedSkillIds ?? [];

    if (currentSkillId.includes(skillId)) {
      setValue('skillIds', currentSkillId.filter((id) => id !== skillId))
    } else {
      setValue('skillIds', [...currentSkillId, skillId])
    }

  }

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
            {isEditing ? 'Edit Project' : 'Add Project'}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-6 space-y-4'
        >
          <Controller
            name='title'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='title'>Title</FieldLabel>
                <Input
                  {...field}
                  id='title'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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

          <Controller
            name='type'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='type'>Type</FieldLabel>
                <select
                  {...field}
                  id='type'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                >
                  {PROJECT_TYPES.map((t) => (
                    <option
                      key={t}
                      value={t}
                    >
                      {t}
                    </option>
                  ))}
                </select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='skillIds'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='skillIds'>Skills</FieldLabel>

                <div className='grid grid-cols-2 gap-2'>
                  {skills?.map((skill) => {
                    const selected = selectedSkillIds?.includes(skill.id)

                    return (
                      <Button
                        key={skill.id}
                        type='button'
                        variant={selected ? 'default' : 'outline'}
                        onClick={() => toggleSkill(skill.id)}
                        className='cursor-pointer'
                      >
                        {skill.name}
                      </Button>
                    )
                  })}
                </div>
              </Field>
            )}
          >

          </Controller>

          {(['githubUrl', 'liveUrl', 'imageUrl'] as const).map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name}>
                    {name === 'githubUrl' ?
                      'GitHub URL'
                    : name === 'liveUrl' ?
                      'Live URL (Optional)'
                    : 'Image URL (Optional)'}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={name}
                    value={field.value ?? ''}
                    placeholder='https://...'
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
            disabled={mutation.isPending}
          >
            {mutation.isPending ?
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            : isEditing ?
              'Save changes'
            : 'Create project'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
