import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  memberLimit: number;
}
