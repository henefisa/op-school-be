import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GetStudentsDto } from './dto/get-students.dto';
import { Role } from 'src/shared/constants';

@Injectable()
export class StudentsService {
  constructor(private readonly usersService: UsersService) {}

  async getStudents(dto: GetStudentsDto) {
    return this.usersService.getUsers({ ...dto, role: Role.Student });
  }
}
