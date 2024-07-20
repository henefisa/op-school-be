import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsService } from './subjects.service';
import { Repository } from 'typeorm/repository/Repository';
import { Subject } from 'src/typeorm/entities/subject.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubjectType } from 'src/shared/constants';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { GetSubjectDto } from './dto/get-subject.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

export const createMockSubject = (
  id: string,
  subjectCode: string,
  name: string,
  type: SubjectType = SubjectType.THEORY,
  numberOfCredits: number,
  theoryCredits: number,
  practiceCredits: number,
  projectCredits: number,
  note: string,
  createdAt: Date = new Date(),
  updatedAt: Date = new Date(),
): Subject => {
  return {
    id,
    subjectCode,
    type,
    name,
    numberOfCredits,
    theoryCredits,
    practiceCredits,
    projectCredits,
    note,
    createdAt,
    updatedAt,
  };
};

const subjectTest = createMockSubject(
  'a uuid 1',
  'AI1',
  'tri tue nhan tao',
  SubjectType.THEORY,
  2,
  2,
  0,
  0,
  'note',
  new Date('2024-01-01'),
  new Date('2024-01-01'),
);

const subjectArray = [
  createMockSubject(
    'a uuid 1',
    'AI1',
    'tri tue nhan tao 1',
    SubjectType.THEORY,
    2,
    2,
    0,
    0,
    'note',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  ),
  createMockSubject(
    'a uuid 2',
    'AI2',
    'tri tue nhan tao 2',
    SubjectType.THEORY,
    2,
    2,
    0,
    0,
    'note',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  ),
  createMockSubject(
    'a uuid 3',
    'AI3',
    'tri tue nhan tao 3',
    SubjectType.THEORY,
    2,
    2,
    0,
    0,
    'note',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  ),
];

describe('SubjectsService', () => {
  let service: SubjectsService;
  let repository: Repository<Subject>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectsService,
        {
          provide: getRepositoryToken(Subject),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([subjectArray, subjectArray.length]),
            findOneOrFail: jest.fn().mockResolvedValue(subjectTest),
            create: jest.fn().mockReturnValue(subjectTest),
            save: jest.fn().mockReturnValue(subjectTest),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<SubjectsService>(SubjectsService);
    repository = module.get<Repository<Subject>>(getRepositoryToken(Subject));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOne', () => {
    it('should get a single subject', () => {
      const repoSpy = jest.spyOn(repository, 'findOneOrFail');
      expect(
        service.getOneOrThrow({ where: { id: 'a uuid 1' } }),
      ).resolves.toEqual(subjectTest);
      expect(repoSpy).toBeCalledWith({ where: { id: 'a uuid 1' } });
    });
    it('should throw an error', () => {
      const repoSpy = jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(
          new NotFoundException(ErrorMessageKey.ClassNotFound),
        );
      expect(
        service.getOneOrThrow({ where: { id: 'a uuid not exists' } }),
      ).rejects.toEqual(new NotFoundException(ErrorMessageKey.ClassNotFound));
      expect(repoSpy).toBeCalledWith({ where: { id: 'a uuid not exists' } });
    });
  });

  describe('create', () => {
    it('should successfully create a subject', async () => {
      const dto: CreateSubjectDto = {
        name: subjectTest.name,
        subjectCode: subjectTest.subjectCode,
        type: subjectTest.type,
        numberOfCredits: subjectTest.numberOfCredits,
        theoryCredits: subjectTest.theoryCredits,
        practiceCredits: subjectTest.practiceCredits,
        projectCredits: subjectTest.projectCredits,
        note: subjectTest.note,
      };
      await expect(service.create(dto)).resolves.toEqual(subjectTest);
      expect(repository.create).toBeCalledWith(dto);
      expect(repository.save).toBeCalledWith(subjectTest);
    });
  });

  describe('update', () => {
    it('should successfully update a subject', async () => {
      const updateDto: UpdateSubjectDto = {
        subjectCode: 'AI1-updated',
        name: 'Updated name',
        type: SubjectType.THEORY,
        numberOfCredits: 3,
        theoryCredits: 2,
        practiceCredits: 1,
        projectCredits: 0,
        note: 'Updated note',
      };

      const repoSpy = jest.spyOn(repository, 'findOneOrFail');
      await expect(service.update('a uuid 1', updateDto)).resolves.toEqual(
        subjectTest,
      );

      expect(repoSpy).toBeCalledWith({ where: { id: 'a uuid 1' } });
      expect(repository.save).toBeCalledWith(
        expect.objectContaining(updateDto),
      );
    });

    it('should throw an error if the subject to update is not found', async () => {
      const updateDto: UpdateSubjectDto = {
        subjectCode: 'AI1-updated',
        name: 'Updated name',
        type: SubjectType.THEORY,
        numberOfCredits: 3,
        theoryCredits: 2,
        practiceCredits: 1,
        projectCredits: 0,
        note: 'Updated note',
      };

      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(
          new NotFoundException(ErrorMessageKey.ClassNotFound),
        );

      await expect(
        service.update('a uuid not exists', updateDto),
      ).rejects.toEqual(new NotFoundException(ErrorMessageKey.ClassNotFound));
    });
  });

  describe('delete', () => {
    it('should successfully delete a subject', async () => {
      await expect(service.delete('a uuid 1')).resolves.toBeUndefined();
      expect(repository.delete).toBeCalledWith({ id: 'a uuid 1' });
    });

    it('should throw a not found error if the subject to delete does not exist', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(
          new NotFoundException(ErrorMessageKey.ClassNotFound),
        );

      await expect(service.delete('a uuid not exists')).rejects.toEqual(
        new NotFoundException(ErrorMessageKey.ClassNotFound),
      );
    });
  });

  describe('getSubjects', () => {
    it('should return an array of subjects', async () => {
      const getSubjectsDto: GetSubjectDto = { page: 1, pageSize: 10 };
      await expect(service.getSubjects(getSubjectsDto)).resolves.toEqual({
        results: subjectArray,
        count: subjectArray.length,
      });
    });

    it('should handle pagination properly', async () => {
      const getSubjectsDto: GetSubjectDto = { page: 2, pageSize: 2 };
      const paginatedSubjects = [subjectArray[2]];

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([paginatedSubjects, paginatedSubjects.length]);

      await expect(service.getSubjects(getSubjectsDto)).resolves.toEqual({
        results: paginatedSubjects,
        count: 1,
      });
    });

    it('should return an empty array if no subjects are found', async () => {
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[], 0]);

      const getSubjectsDto: GetSubjectDto = { page: 1, pageSize: 10 };
      await expect(service.getSubjects(getSubjectsDto)).resolves.toEqual({
        results: [],
        count: 0,
      });
    });
  });
});
