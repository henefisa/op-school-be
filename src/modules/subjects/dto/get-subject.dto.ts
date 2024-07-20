import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dto';

export class GetSubjectDto extends PartialType(PaginationDto) {}
