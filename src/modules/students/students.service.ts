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
import { UpdateStudentDto } from './dto/update-student.dto';

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

  async isEmailAvailable(email: string) {
    const student = await this.usersService.getOne({
      where: {
        email,
      },
    });

    return !!student;
  }

  async create(dto: CreateStudentDto) {
    const isStudentExist = await this.isEmailAvailable(dto.email);

    if (isStudentExist) {
      throw new BadRequestException('Student already exist.');
    }

    // TODO: check parenID matches

    const hasdedPassword = await bcrypt.hash(dto.password, 10);

    return this.userRepository.save({
      email: dto.email,
      birthday: dto.birthday,
      firstName: dto.firstName,
      middleName: dto.middleName,
      lastName: dto.lastName,
      nickname: dto.nickname,
      role: Role.Student,
      gender: dto.gender,
      password: hasdedPassword,
      parentId: dto.parentId,
    });
  }

  async update(id: string, dto: UpdateStudentDto) {
    const student = await this.getOneOrThrow({
      where: {
        id,
      },
    });

    Object.assign(student, dto);

    return this.userRepository.save(student);
  }

  async delete(id: string) {
    return this.userRepository.delete({ id });
  }
}
