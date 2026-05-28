'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Pencil, Trash2, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useExperiences, useDeleteExperience } from '@/hooks/use-portfolio';
import { useAuthStore } from '@/store/auth.store';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { ExperienceEditSheet } from '@/components/editor/experience-edit-sheet';
import type { Experience, EmploymentType } from '@/types';
import { ConfirmDialog } from '../ui/confirm-dialog';

const EMPLOYMENT_LABEL: Record<EmploymentType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  FREELANCE: 'Freelance',
  CONTRACT: 'Contract',
};

export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: '-80px',
  });
  const { data: experiences, isLoading } = useExperiences();
  const { isAuthenticated } = useAuthStore();
  const deleteMutation = useDeleteExperience();
  const [editTarget, setEditTarget] = useState<Experience | null>(null);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });

  return (
    <SectionWrapper
      title='Experience'
      action={
        isAuthenticated ?
          <Button
            size='sm'
            onClick={() => setCreateOpen(true)}
            className='cursor-pointer gap-2'
          >
            <Plus className='size-4' />
            Add
          </Button>
        : undefined
      }
    >
      <div ref={ref}>
        {isLoading ?
          <div className='space-y-8'>
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className='space-y-2 border-l-2 border-border pl-6'
              >
                <Skeleton className='h-5 w-48' />
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-full' />
              </div>
            ))}
          </div>
        : <div className='space-y-8'>
            {experiences?.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className='group relative border-l-2 border-border pl-6'
              >
                {/* Timeline dot */}
                <div className='absolute -left-1.25 top-2 h-2 w-2 rounded-full bg-foreground' />

                {/* Admin controls */}
                {isAuthenticated && (
                  <div className='absolute right-0 top-0 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7 cursor-pointer'
                      onClick={() => setEditTarget(exp)}
                    >
                      <Pencil className='h-3 w-3' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7 text-destructive hover:text-destructive cursor-pointer'
                      // onClick={() => deleteMutation.mutate(exp.id)}
                      onClick={() => setDeleteTarget(exp.id)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                )}

                <div className='space-y-2 pr-16'>
                  {/* Title + badges */}
                  <div className='flex flex-wrap items-center gap-2'>
                    <h3 className='font-semibold'>{exp.position}</h3>
                    <Badge variant='outline'>
                      {EMPLOYMENT_LABEL[exp.employmentType as EmploymentType]}
                    </Badge>
                    <Badge variant='secondary'>
                      {exp.teamworkType === 'SOLO' ?
                        <span className='flex items-center gap-1'>
                          <User className='h-3 w-3' /> Solo
                        </span>
                      : <span className='flex items-center gap-1'>
                          <Users className='h-3 w-3' /> Team
                        </span>
                      }
                    </Badge>
                  </div>

                  <p className='text-sm font-medium text-muted-foreground'>
                    {exp.company}
                  </p>

                  <p className='text-xs text-muted-foreground'>
                    {formatDate(exp.startDate)} —{' '}
                    {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </p>

                  <p className='text-sm leading-relaxed text-muted-foreground'>
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        }
      </div>

      {editTarget && (
        <ExperienceEditSheet
          open={!!editTarget}
          onOpenChange={(o) => !o && setEditTarget(null)}
          defaultValues={editTarget}
        />
      )}

      <ExperienceEditSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {/* ConfirmDialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={'Delete experience?'}
        description={'This will permanently delete this project and cannot be undone.'}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget, {
              onSuccess: () => setDeleteTarget(null)
            })
          }
        }}
        isPending={deleteMutation.isPending}
      />
    </SectionWrapper>
  );
}
