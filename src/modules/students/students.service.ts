import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GetStudentsDto } from './dto/get-students.dto';
import { Role } from 'src/shared/constants';
import { CreateStudentDto } from './dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/shared/base.service';
import { EntityName } from 'src/shared/error-messages';
import bcrypt from 'bcrypt';

@Injectable()
export class StudentsService extends BaseService<User> {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(EntityName.User, userRepository);
  }

  async findAll(dto: GetStudentsDto) {
    return this.usersService.findAll({ ...dto, role: Role.Student });
  }

  async create(dto: CreateStudentDto) {
    if (dto.role !== Role.Student) {
      throw new BadRequestException('The role must be STUDENT');
    }

    // TODO: refactor with isEmailAvailable function
    const user = await this.usersService.getOne({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      throw new BadRequestException('Student already exist.');
    }

    // TODO: check parenID matches

    const hasdedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepository.create(dto);
    newUser.password = hasdedPassword;

    return this.userRepository.save(newUser);
  }
}
