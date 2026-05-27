'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, GitBranch, Link } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useContact, useUpsertContact } from '@/hooks/use-portfolio';
import { useAuthStore } from '@/store/auth.store';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { ContactEditSheet } from '@/components/editor/contact-edit-sheet';

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: '-80px',
  });
  const { data: contact, isLoading } = useContact();
  const { isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);
  const mutation = useUpsertContact();

  return (
    <SectionWrapper
      title='Contact'
      onEdit={isAuthenticated ? () => setOpen(true) : undefined}
    >
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {isLoading ?
            <div className='flex gap-6'>
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-5 w-24' />
            </div>
          : contact ?
            <div className='flex flex-wrap gap-6'>
              <a
                href={`mailto:${contact.email}`}
                className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
              >
                <Mail className='h-4 w-4' />
                {contact.email}
              </a>
              {contact.github && (
                <a
                  href={contact.github}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
                >
                  <GitBranch className='h-4 w-4' />
                  GitHub
                </a>
              )}
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
                >
                  <Link className='h-4 w-4' />
                  LinkedIn
                </a>
              )}
            </div>
          : null}
        </motion.div>
      </div>

      {contact && (
        <ContactEditSheet
          open={open}
          onOpenChange={setOpen}
          defaultValues={contact}
          onSubmit={(values) =>
            mutation.mutate(values, { onSuccess: () => setOpen(false) })
          }
          isPending={mutation.isPending}
        />
      )}
    </SectionWrapper>
  );
}
