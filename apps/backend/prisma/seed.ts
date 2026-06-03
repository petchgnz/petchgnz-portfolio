import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import {
  PrismaClient,
  ProjectType,
  SkillCategory,
  SkillLevel,
} from '@prisma/client';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding initial data...');

  // -- create admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? 'phetchgnz@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin1423';

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({ data: { email: adminEmail, password: hashed } });

    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  // -- clear existing data
  await prisma.projectSkill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.heroSection.deleteMany();
  await prisma.aboutSection.deleteMany();
  await prisma.contact.deleteMany();

  // -- hero section
  await prisma.heroSection.create({
    data: {
      name: 'Phummarin Rojanamarn',
      title: 'Full-Stack Developer',
      subtitle: 'Building modern web experience',
      bio: 'Passionate developer who loves building clean, scalable applications with great user experiences.',
    },
  });

  // -- about section
  await prisma.aboutSection.create({
    data: {
      description:
        'I am a full-stack developer with experiences inbuilding web application using modern technologies like Next.js, Nest.js and PostgreSQL',
      location: 'Bangkok, Thailand',
      availability: 'Open to opportunities',
    },
  });

  // -- skills
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        name: 'TypeScript',
        level: SkillLevel.ADVANCE,
        category: SkillCategory.FRONTEND,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'React',
        level: SkillLevel.ADVANCE,
        category: SkillCategory.FRONTEND,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Next.js',
        level: SkillLevel.ADVANCE,
        category: SkillCategory.FRONTEND,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'ASP.NET Core',
        level: SkillLevel.INTERMEDIATED,
        category: SkillCategory.FRONTEND,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'NestJS',
        level: SkillLevel.INTERMEDIATED,
        category: SkillCategory.BACKEND,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'PostgreSQL',
        level: SkillLevel.INTERMEDIATED,
        category: SkillCategory.DATABASE,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Prisma',
        level: SkillLevel.INTERMEDIATED,
        category: SkillCategory.DATABASE,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Docker',
        level: SkillLevel.INTERMEDIATED,
        category: SkillCategory.DEVOPS,
      },
    }),
  ]);

  // ── Projects ──────────────────────────────────────────────────────────────
  await prisma.project.create({
    data: {
      title: 'Personal Portfolio CMS',
      description:
        'A full-stack portfolio website with a built-in CMS for managing content without touching code.',
      type: ProjectType.WEB,
      githubUrl: 'https://github.com/petchgnz/petchgnz-portfolio',
      order: 1,
      skills: {
        create: [
          { skillId: skills[0].id }, // TypeScript
          { skillId: skills[1].id }, // Next.js
          { skillId: skills[2].id }, // NestJS
          { skillId: skills[3].id }, // Prisma
          { skillId: skills[4].id }, // PostgreSQL
        ],
      },
    },
  });

  // -- contact section
  await prisma.contact.create({
    data: {
      email: 'phetchgnz@gmail.com',
      github: 'https://github.com/petchgnz',
      linkedin: 'https://linkedin.com/in/petchgnz',
    },
  });

  // -- experience
  await prisma.experience.createMany({
    data: [
      {
        company: 'App Intouch Co., Ltd.',
        position: 'Software Developer',
        startDate: new Date('2025-11-17'),
        endDate: new Date('2026-04-02'),
        description:
          'Building and maintaining web applications for Thailand FDA',
        order: 1,
      },
      {
        company: 'MyHost Company Limited',
        position: 'Frontend Developer',
        startDate: new Date('2025-06-30'),
        endDate: new Date('2025-07-29'),
        description:
          'Building and maintaining web applications for Thailand FDA',
        order: 2,
      },
    ],
  });

  console.log('Seeding Complete...');
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
