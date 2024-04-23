import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dto';

export class GetStudentsDto extends PartialType(PaginationDto) {}
