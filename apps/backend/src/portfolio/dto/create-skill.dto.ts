import { IsString, IsEnum } from 'class-validator';
import { SkillLevel, SkillCategory } from '@prisma/client';

export class CreateSkillDto {
  @IsString() name!: string;
  @IsEnum(SkillLevel) level!: SkillLevel;
  @IsEnum(SkillCategory) category!: SkillCategory;
}
