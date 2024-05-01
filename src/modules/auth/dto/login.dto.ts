import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'abcd@1234' })
  password: string;
}
