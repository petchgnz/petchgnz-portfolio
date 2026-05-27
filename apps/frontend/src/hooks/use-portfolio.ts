import api from '@/lib/axios';
import { AboutSection, ContactSection, Experience, HeroSection, Project, Skill } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const portfolioKeys = {
  hero: ['portfolio', 'hero'] as const,
  about: ['portfolio', 'about'] as const,
  contact: ['portfolio', 'contact'] as const,
  skills: ['portfolio', 'skills'] as const,
  projects: ['portfolio', 'projects'] as const,
  experiences: ['portfolio', 'experiences'] as const,
};

// -- Hero -----
export function useHero() {
  return useQuery<HeroSection>({
    queryKey: portfolioKeys.hero,
    queryFn: () => api.get('/portfolio/hero').then((res) => res.data),
  });
}

export function useUpsertHero() {
  const queryClient = useQueryClient();

  return useMutation<HeroSection, Error, Partial<HeroSection>>({
    mutationFn: (data) =>
      api.patch('/portfolio/hero', data).then((res) => res.data),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: portfolioKeys.hero }),
  });
}

// -- About -----
export function useAbout() {
  return useQuery<AboutSection>({
    queryKey: portfolioKeys.about,
    queryFn: () => api.get('/portfolio/about').then((res) => res.data),
  });
}

export function useUpsertAbout() {
  const queryClient = useQueryClient();

  return useMutation<AboutSection, Error, Partial<AboutSection>>({
    mutationFn: (data) =>
      api.patch('/portfolio/about', data).then((res) => res.data),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: portfolioKeys.about }),
  });
}

// -- Skills -----
export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: portfolioKeys.skills,
    queryFn: () => api.get('/portfolio/skills').then((res) => res.data),
  });
}

// -- Projects =====
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: portfolioKeys.projects,
    queryFn: () => api.get('/portfolio/projects').then((res) => res.data),
  });
}

export function useUpsertProject() {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, Partial<Project> & { id?: string }>({
    mutationFn: ({ id, ...data }) =>
      id ?
        api.patch(`/portfolio/projects/${id}`, data).then((res) => res.data)
      : api.post('/portfolio/projects', data).then((res) => res.data),

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: portfolioKeys.projects }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/portfolio/projects/${id}`),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: portfolioKeys.projects }),
  });
}

// ── Experience ────────────────────────────────────────────────────────────────
export function useExperiences() {
  return useQuery<Experience[]>({
    queryKey: portfolioKeys.experiences,
    queryFn: () => api.get('/portfolio/experiences').then((r) => r.data),
  })
}

export function useUpsertExperience() {
  const queryClient = useQueryClient()
  return useMutation<Experience, Error, Partial<Experience> & { id?: string }>({
    mutationFn: ({ id, ...data }) =>
      id
        ? api.patch(`/portfolio/experiences/${id}`, data).then((r) => r.data)
        : api.post('/portfolio/experiences', data).then((r) => r.data),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: portfolioKeys.experiences }),
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/portfolio/experiences/${id}`),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: portfolioKeys.experiences }),
  })
}

// ── Contact ───────────────────────────────────────────────────────────────────
export function useContact() {
  return useQuery<ContactSection>({
    queryKey: portfolioKeys.contact,
    queryFn: () => api.get('/portfolio/contact').then((r) => r.data),
  })
}

export function useUpsertContact() {
  const queryClient = useQueryClient()
  return useMutation<ContactSection, Error, Partial<ContactSection>>({
    mutationFn: (data) =>
      api.patch('/portfolio/contact', data).then((r) => r.data),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: portfolioKeys.contact }),
  })
}
