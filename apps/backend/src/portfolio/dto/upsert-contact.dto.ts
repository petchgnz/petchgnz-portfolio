import { IsEmail, IsOptional, IsUrl } from 'class-validator';

export class UpsertContactDto {
  @IsEmail() email!: string;
  @IsOptional() @IsUrl() github?: string;
  @IsOptional() @IsUrl() linkedin?: string;
}
