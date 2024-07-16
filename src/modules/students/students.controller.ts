import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { GetStudentsDto } from './dto/get-students.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller({ path: 'students', version: '1' })
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@ApiTags('Students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getStudents(@Query() dto: GetStudentsDto) {
    console.log(new Date());
    return this.studentsService.findAll(dto);
  }

  @Post()
  async create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }
}
