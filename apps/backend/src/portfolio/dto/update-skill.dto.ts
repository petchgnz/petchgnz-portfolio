import { IsString, IsEnum, IsOptional } from 'class-validator';
import { SkillLevel, SkillCategory } from '@prisma/client';

export class UpdateSkillDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(SkillLevel) level?: SkillLevel;
  @IsOptional() @IsEnum(SkillCategory) category?: SkillCategory;
}
