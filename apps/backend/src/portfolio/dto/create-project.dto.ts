import {
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { ProjectType } from '../../../generated/prisma/client';

export class CreateProjectDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsEnum(ProjectType) type!: ProjectType;
  @IsOptional() @IsUrl() githubUrl?: string;
  @IsOptional() @IsUrl() liveUrl?: string;
  @IsOptional() @IsUrl() imageUrl?: string;
  @IsOptional() @IsInt() @Min(0) order?: number;

  @IsOptional() @IsArray() @IsString({ each: true }) skillIds?: string[];
}
