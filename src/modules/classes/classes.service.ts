import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/typeorm/entities/class.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { UpdateClassDto } from './dto/update-class.dto';
import { GetClassDto } from './dto/get-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
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

  async getMany(dto: GetClassDto) {
    const [results, count] = await this.classRepository.findAndCount({
      skip: (dto.page - 1) * dto.pageSize,
      take: dto.pageSize,
    });

    return {
      results,
      count,
    };
  }
}
