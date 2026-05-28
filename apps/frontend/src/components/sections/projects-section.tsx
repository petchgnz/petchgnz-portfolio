'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Plus, GitBranch, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useProjects, useDeleteProject } from '@/hooks/use-portfolio'
import { useAuthStore } from '@/store/auth.store'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { ProjectEditSheet } from '@/components/editor/project-edit-sheet'
import type { Project, ProjectType } from '@/types'

const TYPE_LABEL: Record<ProjectType, string> = {
  WEB:    'Web',
  MOBILE: 'Mobile',
  GAME:   'Game',
  OTHER:  'Other',
}

export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: '-80px',
  })
  const { data: projects, isLoading } = useProjects()
  const { isAuthenticated } = useAuthStore()
  const deleteMutation = useDeleteProject()
  const [editTarget, setEditTarget] = useState<Project | null>(null)
  const [createOpen, setCreateOpen] = useState<boolean>(false)

  return (
    <SectionWrapper
      title="Projects"
      maxWidth="md"
      action={
        isAuthenticated ? (
          <Button variant={'default'} size="sm" onClick={() => setCreateOpen(true)} className='cursor-pointer gap-2'>
            <Plus className="size-4" />
            Add Project
          </Button>
        ) : undefined
      }
    >
      <div ref={ref}>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects?.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <Card className="group relative h-full transition-shadow hover:shadow-md">
                  {/* Admin controls — แสดงเมื่อ hover */}
                  {isAuthenticated && (
                    <div className="absolute right-3 top-3 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setEditTarget(project)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(project.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 pr-16">
                      <CardTitle className="text-base leading-snug">
                        {project.title}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {TYPE_LABEL[project.type]}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>

                    {/* Skills */}
                    {project.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map(({ skill }) => (
                          <span
                            key={skill.id}
                            className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <GitBranch className="h-3 w-3" />
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit sheet */}
      {editTarget && (
        <ProjectEditSheet
          open={!!editTarget}
          onOpenChange={(o) => !o && setEditTarget(null)}
          defaultValues={editTarget}
        />
      )}

      {/* Create sheet */}
      <ProjectEditSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </SectionWrapper>
  )
}