'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAbout, useUpsertAbout } from '@/hooks/use-portfolio';
import { useAuthStore } from '@/store/auth.store';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { AboutEditSheet } from '@/components/editor/about-edit-sheet';

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: '-80px',
  });
  const { data: about, isLoading } = useAbout();
  const { isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);
  const mutation = useUpsertAbout();

  return (
    <SectionWrapper
      id='about'
      title='About'
      onEdit={isAuthenticated ? () => setOpen(true) : undefined}
    >
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {isLoading ?
            <div className='space-y-3'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
              <Skeleton className='h-4 w-4/6' />
            </div>
          : about ?
            <div className='space-y-6'>
              <p className='leading-relaxed text-muted-foreground'>
                {about.description}
              </p>
              <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <MapPin className='h-4 w-4 shrink-0' />
                  {about.location}
                </div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Briefcase className='h-4 w-4 shrink-0' />
                  {about.availability}
                </div>
              </div>
            </div>
          : null}
        </motion.div>
      </div>

      {about && (
        <AboutEditSheet
          open={open}
          onOpenChange={setOpen}
          defaultValues={about}
          onSubmit={(values) =>
            mutation.mutate(values, { onSuccess: () => setOpen(false) })
          }
          isPending={mutation.isPending}
        />
      )}
    </SectionWrapper>
  );
}
