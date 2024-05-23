import { IsOptional, IsString } from 'class-validator';

export class UpdateClassDto {
  @IsString()
  @IsOptional()
  name?: string;
}
