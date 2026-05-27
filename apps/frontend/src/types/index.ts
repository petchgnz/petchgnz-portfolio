// ----- Auth
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ----- Enums
export type ProjectType = 'WEB' | 'MOBILE' | 'GAME' | 'OTHER';
export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'FREELANCE'
  | 'CONTRACT';
export type TeamworkType = 'SOLO' | 'TEAM';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATED' | 'ADVANCE' | 'EXPERT';
export type SkillCategory =
  | 'FRONTEND'
  | 'BACKEND'
  | 'DATABASE'
  | 'DEVOPS'
  | 'TOOL';

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
export interface Skill {
  id: string
  name: string
  level: SkillLevel
  category: SkillCategory
}

export interface ProjectSkill {
  projectId: string
  skillId: string
  skill: Skill
}

export interface SkillSection {
  id: string;
  name: string;
  level: string;
  category: string;
}

export interface Project {
  id: string
  title: string
  description: string
  type: ProjectType
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  order: number
  skills: ProjectSkill[]
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  startDate: string
  endDate?: string
  employmentType: EmploymentType
  teamworkType: TeamworkType
  order: number
}

export interface ContactSection {
  id: string;
  email: string;
  github?: string;
  linkedin?: string;
}
