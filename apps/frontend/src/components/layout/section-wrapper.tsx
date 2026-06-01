// Reusable wrapper for every section
// manage layout, title, edit button, and separator only in this file

import { ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/auth.store'

interface Props {
  id?: string
  title: string
  children: ReactNode
  onEdit?: () => void
  action?: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const MAX_WIDTH = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
}

export function SectionWrapper({
  id,
  title,
  children,
  onEdit,
  action,
  className = '',
  maxWidth = 'md',
}: Props) {
  const { isAuthenticated } = useAuthStore()

  return (
    <section className={`mx-auto px-6 py-24 ${MAX_WIDTH[maxWidth]} ${className}`} id={id}>
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          {/* <h2 className="text-3xl font-bold tracking-tight">{title}</h2> */}

          {/* experimental */}
          <div className='flex w-full items-center gap-4'>
            <div className='h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent' />
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <div className='h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent' />
          </div>


          <div className="relative items-center gap-2">
            {/* Custom action */}
            {action}
            {/* Edit button for admin only */}
            {isAuthenticated && onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className='absolute -top-3.5 left-5 gap-2 cursor-pointer'>
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* <Separator /> */}

        {children}
      </div>
    </section>
  )
}