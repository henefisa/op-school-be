import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateClassDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  memberLimit?: number;
}
