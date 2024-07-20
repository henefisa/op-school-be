import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'src/typeorm/entities/subject.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { GetSubjectDto } from './dto/get-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(dto: CreateSubjectDto) {
    const newSubject = this.subjectRepository.create(dto);

    return this.subjectRepository.save(newSubject);
  }

  async getOneOrThrow(options: FindOneOptions<Subject>) {
    return await this.subjectRepository.findOneOrFail(options).catch(() => {
      throw new NotFoundException(ErrorMessageKey.ClassNotFound);
    });
  }

  async update(id: string, dto: UpdateSubjectDto) {
    const subject = await this.getOneOrThrow({
      where: {
        id,
      },
    });

    Object.assign(subject, dto);

    return this.subjectRepository.save(subject);
  }

  async delete(id: string) {
    await this.subjectRepository.delete({ id });
  }

  async getSubjects(dto: GetSubjectDto) {
    const [results, count] = await this.subjectRepository.findAndCount({
      skip: (dto.page - 1) * dto.pageSize,
      take: dto.pageSize,
    });

    return {
      results,
      count,
    };
  }
}
