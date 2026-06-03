import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import {
  AboutSection,
  Contact,
  HeroSection,
} from '../../generated/prisma/client';
import { UpsertHeroDto } from './dto/upsert-hero.dto';
import { UpsertAboutDto } from './dto/upsert-about.dto';
import { UpsertContactDto } from './dto/upsert-contact.dto';
import { Experience, Project, Skill } from '../../generated/prisma/client';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // -- Hero ----------
  @Get('hero')
  getHero(): Promise<HeroSection> {
    return this.portfolioService.getHero();
  }

  @Patch('hero')
  @UseGuards(JwtAuthGuard)
  upsertHero(@Body() dto: UpsertHeroDto): Promise<HeroSection> {
    return this.portfolioService.upsertHero(dto);
  }

  // -- About ----------
  @Get('about')
  getAbout(): Promise<AboutSection> {
    return this.portfolioService.getAbout();
  }

  @Patch('about')
  @UseGuards(JwtAuthGuard)
  upsertAbout(@Body() dto: UpsertAboutDto): Promise<AboutSection> {
    return this.portfolioService.upsertAbout(dto);
  }

  // -- Contact ----------
  @Get('contact')
  getContact(): Promise<Contact> {
    return this.portfolioService.getContact();
  }

  @Patch('contact')
  @UseGuards(JwtAuthGuard)
  upsertContact(@Body() dto: UpsertContactDto): Promise<Contact> {
    return this.portfolioService.upsertContact(dto);
  }

  // -- Skills ----------
  @Get('skills')
  getSkills(): Promise<Skill[]> {
    return this.portfolioService.getSkills();
  }

  @Post('skills')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createSkill(@Body() dto: CreateSkillDto): Promise<Skill> {
    return this.portfolioService.createSKill(dto);
  }

  @Patch('skills/:id')
  @UseGuards(JwtAuthGuard)
  updateSkill(
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
  ): Promise<Skill> {
    return this.portfolioService.updateSkill(id, dto);
  }

  @Delete('skills/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSkill(@Param('id') id: string): Promise<void> {
    return this.portfolioService.deleteSkill(id);
  }

  // -- Project ----------
  @Get('projects')
  getProjects(): Promise<Project[]> {
    return this.portfolioService.getProjects();
  }

  @Get('projects/:id')
  getProjectById(@Param('id') id: string): Promise<Project> {
    return this.portfolioService.getProjectById(id);
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createProject(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.portfolioService.createProject(dto);
  }

  @Patch('projects/:id')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.portfolioService.updateProject(id, dto);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProject(@Param('id') id: string): Promise<void> {
    return this.portfolioService.deleteProject(id);
  }

  // -- Experience ----------
  @Get('experiences')
  getExperiences(): Promise<Experience[]> {
    return this.portfolioService.getExperiences();
  }

  @Post('experiences')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createExperience(@Body() dto: CreateExperienceDto): Promise<Experience> {
    return this.portfolioService.createExperience(dto);
  }

  @Patch('experiences/:id')
  @UseGuards(JwtAuthGuard)
  updateExperience(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
  ): Promise<Experience> {
    return this.portfolioService.updateExperience(id, dto);
  }

  @Delete('experiences/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteExperience(@Param('id') id: string): Promise<void> {
    return this.portfolioService.deleteExperience(id);
  }
}
