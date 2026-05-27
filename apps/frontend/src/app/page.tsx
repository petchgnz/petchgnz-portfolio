'use client';

import Navbar from '@/components/layout/navbar';
import { AboutSection } from '@/components/sections/about-section';
import { ContactSection } from '@/components/sections/contact-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { HeroSection } from '@/components/sections/hero-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';


const HomePage = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='mx-auto max-w-5xl px-6 py-16'>
        <HeroSection />
        <Separator />
        <AboutSection />
        <Separator />
        <SkillsSection />
        <Separator />
        <ProjectsSection />
        <Separator />
        <ExperienceSection />
        <Separator />
        <ContactSection />
      </main>

      <footer className='border-t py-8 text-center text-sm text-muted-foreground'>
        Built with Next.js · NestJS · Prisma
      </footer>
    </div>
  );
};
export default HomePage;
