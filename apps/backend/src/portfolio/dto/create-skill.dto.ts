import { IsString, IsEnum } from 'class-validator';
import { SkillLevel, SkillCategory } from '../../../generated/prisma/client';

export class CreateSkillDto {
  @IsString() name!: string;
  @IsEnum(SkillLevel) level!: SkillLevel;
  @IsEnum(SkillCategory) category!: SkillCategory;
}
