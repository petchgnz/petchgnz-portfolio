'use client';

import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useHero, useUpsertHero } from '@/hooks/use-portfolio';
import { useAuthStore } from '@/store/auth.store';
import { HeroEditSheet } from '@/components/editor/hero-edit-sheet';
import { useState } from 'react';
import AvailabilityBadge from '../features/availabity-badge';

export function HeroSection() {
  const { data: hero, isLoading } = useHero();
  const { isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);
  const mutation = useUpsertHero();

  if (isLoading) {
    return (
      <section className='flex min-h-[80vh] items-center justify-center px-6'>
        <div className='space-y-4 text-center'>
          <Skeleton className='mx-auto h-12 w-64' />
          <Skeleton className='mx-auto h-6 w-48' />
          <Skeleton className='mx-auto h-4 w-96' />
        </div>
      </section>
    );
  }

  if (!hero) return null;

  return (
    <section className='relative flex min-h-[80vh] items-center justify-center px-6' id='hero'>
      {/* Edit button */}
      {isAuthenticated && (
        <Button
          size='sm'
          variant='outline'
          className='absolute cursor-pointer right-6 top-6 gap-2'
          onClick={() => setOpen(true)}
        >
          <Pencil className='h-3 w-3' />
          Edit
        </Button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='max-w-2xl space-y-4 text-center'
      >
        <div className=''>
          <AvailabilityBadge />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className='text-5xl font-bold tracking-tight'
        >
          {hero.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='text-2xl font-medium text-muted-foreground'
        >
          {hero.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className='text-lg text-muted-foreground'
        >
          {hero.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className='text-base leading-relaxed text-muted-foreground'
        >
          {hero.bio}
        </motion.p>
      </motion.div>

      <HeroEditSheet
        open={open}
        onOpenChange={setOpen}
        defaultValues={hero}
        onSubmit={(values) =>
          mutation.mutate(values, { onSuccess: () => setOpen(false) })
        }
        isPending={mutation.isPending}
      />
    </section>
  );
}
