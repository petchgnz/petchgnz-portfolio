import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { EmploymentType, TeamworkType } from '../../../generated/prisma/client';

export class UpdateExperienceDto {
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() position?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsEnum(EmploymentType) employmentType?: EmploymentType;
  @IsOptional() @IsEnum(TeamworkType) teamworkType?: TeamworkType;
  @IsOptional() @IsInt() order?: number;
}
