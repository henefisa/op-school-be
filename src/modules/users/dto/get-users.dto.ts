import { PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from 'src/shared/constants';
import { PaginationDto } from 'src/shared/dto';

export class GetUsersDto extends PartialType(PaginationDto) {
  @IsEnum(Role)
  role: Role;
}
