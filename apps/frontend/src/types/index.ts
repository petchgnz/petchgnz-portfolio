import { DateTimeFieldRefInput } from './../../../backend/generated/prisma/internal/prismaNamespace';
// ----- Auth
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ----- Portfolio Sections
export interface HeroSection {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  bio: string;
}

export interface AboutSection {
  id: string;
  description: string;
  location: string;
  availability: string;
}

export interface SkillSectin {
  id: string;
  name: string;
  level: string;
  category: string;
}

export interface ProjectSection {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

export interface ExperienceSection {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface ContactSection {
  id: string;
  email: string;
  github?: string;
  linkedin?: string;
}
