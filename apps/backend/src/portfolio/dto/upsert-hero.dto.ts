import { IsString, MinLength } from 'class-validator';

export class UpsertHeroDto {
  @IsString() name!: string;
  @IsString() title!: string;
  @IsString() subtitle!: string;
  @IsString() @MinLength(10) bio!: string;
}
