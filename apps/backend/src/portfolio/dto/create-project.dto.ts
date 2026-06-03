import {
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
  IsArray,
  IsInt,
  Min,
  ValidateIf,
} from 'class-validator';
import { ProjectType } from '@prisma/client';

export class CreateProjectDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsEnum(ProjectType) type!: ProjectType;
  // @IsOptional() @IsUrl() githubUrl?: string;
  // @IsOptional() @IsUrl() liveUrl?: string;
  // @IsOptional() @IsUrl() imageUrl?: string;
  @IsOptional() @IsInt() @Min(0) order?: number;

  @IsOptional() @IsArray() @IsString({ each: true }) skillIds?: string[];

  @ValidateIf((o) => o.githubUrl !== '' && o.githubUrl !== null)
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ValidateIf((o) => o.liveUrl !== '' && o.liveUrl !== null)
  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @ValidateIf((o) => o.imageUrl !== '' && o.imageUrl !== null)
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
