import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/typeorm/entities/class.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';

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
}
