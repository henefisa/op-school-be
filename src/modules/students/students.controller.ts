import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { GetStudentsDto } from './dto/get-students.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'students', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async getStudents(@Query() dto: GetStudentsDto) {
    return this.studentsService.getStudents(dto);
  }
}
