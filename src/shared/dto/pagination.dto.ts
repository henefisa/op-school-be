import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @Min(0)
  @IsOptional()
  @ApiProperty({ example: 1 })
  page = 1;

  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @Min(1)
  @Max(50)
  @IsOptional()
  @ApiProperty({ example: 10 })
  pageSize = 10;
}
