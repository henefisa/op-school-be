import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { GetSubjectDto } from './dto/get-subject.dto';

@Controller('subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  async createSubject(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(dto);
  }

  @Patch(':id')
  async updateSubject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, dto);
  }

  @Delete(':id')
  async deleteSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.delete(id);
  }

  @Get()
  async getSubject(@Query() dto: GetSubjectDto) {
    return this.subjectsService.getSubjects(dto);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.getOneOrThrow({ where: { id } });
  }
}
