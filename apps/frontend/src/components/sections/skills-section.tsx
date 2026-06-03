'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteSkill, useSkills } from '@/hooks/use-portfolio';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import type { SkillCategory, SkillLevel } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { SkillEditSheet } from '../editor/skill-edit-sheet';
import { ConfirmDialog } from '../ui/confirm-dialog';

const LEVEL_STYLE: Record<SkillLevel, string> = {
  BEGINNER: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  INTERMEDIATED:
    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  ADVANCE:
    'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  EXPERT: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

const LEVEL_ORDER: Record<SkillLevel, number> = {
  EXPERT: 4,
  ADVANCE: 3,
  INTERMEDIATED: 2,
  BEGINNER: 1,
};

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  DEVOPS: 'DevOps',
  TOOL: 'Tools',
};

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAuthStore();
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const deleteMutation = useDeleteSkill();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: '-80px',
  });
  const { data: skills, isLoading } = useSkills();

  // grouped from category
  const grouped = skills?.reduce<Partial<Record<SkillCategory, typeof skills>>>(
    (acc, skill) => {
      const cat = skill.category as SkillCategory;
      if (!acc[cat]) acc[cat] = [];
      acc[cat]!.push(skill);
      return acc;
    },
    {},
  );

  return (
    <SectionWrapper
      title='Skills'
      id='skills'
      action={
        isAuthenticated ?
          <Button
            variant={'default'}
            size='sm'
            onClick={() => setCreateOpen(true)}
            className='absolute -top-3.5  cursor-pointer gap-2'
          >
            <Plus className='size-4' />
            Add Skill
          </Button>
        : undefined
      }
    >
      <div ref={ref}>
        {isLoading ?
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className='h-7 w-24 rounded-full'
              />
            ))}
          </div>
        : grouped ?
          <div className='space-y-8'>
            {(Object.entries(grouped) as [SkillCategory, typeof skills][]).map(
              ([category, items], idx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className='space-y-3'
                >
                  <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground pointer-events-none'>
                    {CATEGORY_LABEL[category]}
                  </p>

                  <div className='flex flex-wrap gap-4'>
                    {items
                      ?.slice()
                      .sort(
                        (a, b) =>
                          LEVEL_ORDER[b.level as SkillLevel] -
                          LEVEL_ORDER[a.level as SkillLevel],
                      )
                      .map((skill) => (
                        <span
                          key={skill.id}
                          className={`group relative inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${LEVEL_STYLE[skill.level as SkillLevel]}`}
                        >
                          {skill.name}

                          {/* admin control (when hovered) */}
                          {isAuthenticated && (
                            // <div className='absolute right-3 top-7 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                            <div className='absolute -right-3 -top-3 opacity-0 group-hover:opacity-100'>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='h-7 w-7 text-destructive hover:text-destructive cursor-pointer'
                                onClick={() => setDeleteTarget(skill.id)}
                              >
                                <X className='h-3 w-3' />
                              </Button>
                            </div>
                          )}
                        </span>
                      ))}
                  </div>
                </motion.div>
              ),
            )}
          </div>
        : null}
      </div>

      {/* Create sheet */}
      <SkillEditSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {/* ConfirmDialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={'Delete skill?'}
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
