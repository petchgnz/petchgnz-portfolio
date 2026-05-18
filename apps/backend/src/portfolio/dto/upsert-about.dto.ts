import { IsString, MinLength } from 'class-validator';

export class UpsertAboutDto {
  @IsString() @MinLength(10) description!: string;
  @IsString() location!: string;
  @IsString() availability!: string;
}
