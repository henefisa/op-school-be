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
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { GetStudentsDto } from './dto/get-students.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller({ path: 'students', version: '1' })
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@ApiTags('Students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async getStudents(@Query() dto: GetStudentsDto) {
    return this.studentsService.findAll(dto);
  }

  @Post()
  async create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.delete(id);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.getOneOrThrow({ where: { id } });
  }
}
