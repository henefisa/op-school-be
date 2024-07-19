import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Gender } from 'src/shared/constants';

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsUUID(4)
  @IsOptional()
  parentId?: string;
}
