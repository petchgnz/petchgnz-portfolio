import {
  AboutSection,
  HeroSection,
  Contact,
  Project,
  Skill,
  Experience,
} from '../../generated/prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpsertHeroDto } from './dto/upsert-hero.dto';
import { UpsertAboutDto } from './dto/upsert-about.dto';
import { UpsertContactDto } from './dto/upsert-contact.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

type ProjectWithSkill = Project & {
  skills: Array<{
    skill: Skill;
    projectId: string;
    skillId: string;
  }>;
};

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  // -- Hero Section ----------
  async getHero(): Promise<HeroSection> {
    const hero = await this.prisma.heroSection.findFirst();
    if (!hero) throw new NotFoundException('Hero section not found');
    return hero;
  }

  async upsertHero(dto: UpsertHeroDto): Promise<HeroSection> {
    const existing = await this.prisma.heroSection.findFirst();

    if (existing) {
      return this.prisma.heroSection.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.heroSection.create({ data: dto });
  }

  // -- About Section ----------
  async getAbout(): Promise<AboutSection> {
    const about = await this.prisma.aboutSection.findFirst();
    if (!about) throw new NotFoundException('About section not found');
    return about;
  }

  async upsertAbout(dto: UpsertAboutDto): Promise<AboutSection> {
    const existing = await this.prisma.aboutSection.findFirst();
    if (existing) {
      return this.prisma.aboutSection.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.aboutSection.create({ data: dto });
  }

  // -- Contact Section ----------
  async getContact(): Promise<Contact> {
    const contact = await this.prisma.contact.findFirst();
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async upsertContact(dto: UpsertContactDto): Promise<Contact> {
    const existing = await this.prisma.contact.findFirst();

    if (existing) {
      return this.prisma.contact.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.contact.create({ data: dto });
  }

  // -- Skills ----------
  // - Helper functions
  private async findSkillOrThrow(id: string): Promise<Skill> {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException(`Skill: ${id} not found`);
    return skill;
  }

  async getSkills(): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async createSKill(dto: CreateSkillDto): Promise<Skill> {
    return this.prisma.skill.create({ data: dto });
  }

  async updateSkill(id: string, dto: UpdateSkillDto): Promise<Skill> {
    await this.findSkillOrThrow(id);
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  async deleteSkill(id: string): Promise<void> {
    await this.findSkillOrThrow(id);
    await this.prisma.skill.delete({ where: { id } });
  }

  // -- Project Section ----------
  async getProjects(): Promise<ProjectWithSkill[]> {
    return await this.prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { skills: { include: { skill: true } } },
    });
  }

  async getProjectById(id: string): Promise<ProjectWithSkill> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { skills: { include: { skill: true } } },
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async createProject(dto: CreateProjectDto): Promise<ProjectWithSkill> {
    const { skillIds, ...projectData } = dto;
    return this.prisma.project.create({
      data: {
        ...projectData,
        skills: skillIds?.length
          ? { create: skillIds.map((skillId: string) => ({ skillId })) }
          : undefined,
      },
      include: { skills: { include: { skill: true } } },
    });
  }

  async updateProject(
    id: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectWithSkill> {
    await this.getProjectById(id);
    const { skillIds, ...projectData } = dto;

    return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,

        githubUrl:
          projectData.githubUrl !== undefined
            ? projectData.githubUrl
            : undefined,
        liveUrl:
          projectData.liveUrl !== undefined ? projectData.liveUrl : undefined,
        imageUrl:
          projectData.imageUrl !== undefined ? projectData.imageUrl : undefined,

        ...(skillIds !== undefined && {
          skills: {
            deleteMany: {},
            create: skillIds.map((skillId: string) => ({ skillId })),
          },
        }),
      },
      include: { skills: { include: { skill: true } } },
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.getProjectById(id);
    await this.prisma.project.delete({ where: { id } });
  }

  // -- Experience ----------
  // - Helper Functions
  private async findExperienceOrThrow(id: string): Promise<Experience> {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException(`Experience: ${id} not found`);
    return exp;
  }

  async getExperiences(): Promise<Experience[]> {
    return this.prisma.experience.findMany({ orderBy: { order: 'asc' } });
  }

  async createExperience(dto: CreateExperienceDto): Promise<Experience> {
    return this.prisma.experience.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async updateExperience(
    id: string,
    dto: UpdateExperienceDto,
  ): Promise<Experience> {
    await this.findExperienceOrThrow(id);
    return this.prisma.experience.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async deleteExperience(id: string): Promise<void> {
    await this.findExperienceOrThrow(id);
    await this.prisma.experience.delete({ where: { id } });
  }
}
