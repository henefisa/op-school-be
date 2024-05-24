import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/typeorm/entities/class.entity';
import { FindOneOptions, In, Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { UpdateClassDto } from './dto/update-class.dto';
import { GetClassDto } from './dto/get-class.dto';
import { AddMembersDto } from './dto/add-members.dto';
import { UserClass } from 'src/typeorm/entities/user-class.entity';
import { UsersService } from '../users/users.service';
import { RemoveMembersDto } from './dto/remove-members.dto';
import { GetMembersDto } from './dto/get-members.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(UserClass)
    private readonly userClassRepository: Repository<UserClass>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateClassDto) {
    const newClass = this.classRepository.create(dto);
    return this.classRepository.save(newClass);
  }

  async getOne(options: FindOneOptions<Class>) {
    return await this.classRepository.findOneOrFail(options).catch(() => {
      throw new NotFoundException(ErrorMessageKey.ClassNotFound);
    });
  }

  async update(id: string, dto: UpdateClassDto) {
    const targetClass = await this.getOne({
      where: {
        id,
      },
    });

    targetClass.name = dto.name;
    // TODO: add validation for member limit
    targetClass.memberLimit = dto.memberLimit;

    return this.classRepository.save(targetClass);
  }

  async delete(id: string) {
    await this.classRepository.delete({ id });
  }

  async getClasses(dto: GetClassDto) {
    const [results, count] = await this.classRepository.findAndCount({
      skip: (dto.page - 1) * dto.pageSize,
      take: dto.pageSize,
    });

    return {
      results,
      count,
    };
  }

  async getMembers(id: string, dto: GetMembersDto) {
    const [results, count] = await this.userClassRepository.findAndCount({
      where: {
        classId: id,
      },
      skip: (dto.page - 1) * dto.pageSize,
      take: dto.pageSize,
      relations: {
        user: true,
      },
    });

    return {
      results,
      count,
    };
  }

  async addMembers(id: string, dto: AddMembersDto) {
    const targetClass = await this.getOne({ where: { id } });
    const users = await this.usersService.getMany({
      where: { id: In(dto.memberIds) },
    });
    // TODO: validate member limit
    const userClasses = users.map(
      (user) => new UserClass(targetClass.id, user.id),
    );
    const saved = await this.userClassRepository.save(userClasses);

    return {
      results: saved,
      count: saved.length,
    };
  }

  async removeMembers(id: string, dto: RemoveMembersDto) {
    const targetClass = await this.getOne({ where: { id } });
    await this.userClassRepository.delete({
      classId: targetClass.id,
      userId: In(dto.memberIds),
    });
  }
}
