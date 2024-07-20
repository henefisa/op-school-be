import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { SubjectType } from 'src/shared/constants';

export class UpdateSubjectDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subjectCode?: string;

  @IsEnum(SubjectType)
  @IsOptional()
  type?: SubjectType;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfCredits?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  theoryCredits?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  practiceCredits?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  projectCredits?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  note: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  finishTime?: string;
}
