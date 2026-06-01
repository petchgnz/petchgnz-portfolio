-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('WEB', 'MOBILE', 'GAME', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT');

-- CreateEnum
CREATE TYPE "TeamworkType" AS ENUM ('SOLO', 'TEAM');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATED', 'ADVANCE', 'EXPERT');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'TOOL', 'GAME_DEV', 'OTHER');

-- CreateTable
CREATE TABLE "hero_section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_section" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "github" TEXT,
    "linkedin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "SkillLevel" NOT NULL DEFAULT 'INTERMEDIATED',
    "category" "SkillCategory" NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_skills" (
    "projectId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "project_skills_pkey" PRIMARY KEY ("projectId","skillId")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ProjectType" NOT NULL DEFAULT 'WEB',
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "teamworkType" "TeamworkType" NOT NULL DEFAULT 'TEAM',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
