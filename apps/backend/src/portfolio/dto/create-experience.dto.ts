import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { EmploymentType, TeamworkType } from '../../../generated/prisma/client';

export class CreateExperienceDto {
  @IsString() company!: string;
  @IsString() position!: string;
  @IsString() description!: string;
  @IsDateString() startDate!: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsEnum(EmploymentType) employmentType!: EmploymentType;
  @IsEnum(TeamworkType) teamworkType!: TeamworkType;
  @IsOptional() @IsInt() order?: number;
}
