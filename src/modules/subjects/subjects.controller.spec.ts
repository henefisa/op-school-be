import { Test, TestingModule } from '@nestjs/testing';
import { SubjectType } from 'src/shared/constants';
import { Subject } from 'src/typeorm/entities/subject.entity';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service'; // Import the service
import { GetSubjectDto } from './dto/get-subject.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { NotFoundException } from '@nestjs/common';

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

const subjectUpdatedTest = createMockSubject(
  'a uuid 1',
  'AI1-updated',
  'Updated name',
  SubjectType.THEORY,
  3,
  2,
  1,
  0,
  'Updated note',
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

describe('Subject Controller', () => {
  let controller: SubjectsController;
  let service: SubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectsController],
      providers: [
        {
          provide: SubjectsService,
          useValue: {
            getSubjects: jest.fn().mockResolvedValue({
              results: subjectArray,
              count: subjectArray.length,
            }),
            getOneOrThrow: jest.fn().mockImplementation((options) => {
              if (options.where.id === 'a uuid 1') {
                return Promise.resolve(subjectTest);
              }
              return Promise.reject(new NotFoundException());
            }),
            create: jest.fn().mockResolvedValue({
              id: 'a uuid 1',
              ...subjectTest,
            }),
            update: jest.fn().mockResolvedValue({
              id: 'a uuid 1',
              ...subjectUpdatedTest,
            }),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        SubjectsController,
      ],
    }).compile();

    controller = module.get<SubjectsController>(SubjectsController);
    service = module.get<SubjectsService>(SubjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    it('should get a single subject', async () => {
      await expect(controller.getById('a uuid 1')).resolves.toEqual(
        subjectTest,
      );
    });

    it('should throw NotFoundException for a different id', async () => {
      await expect(controller.getById('a different id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('newSubject', () => {
    it('should create a new subject', async () => {
      const newSubjectDto: CreateSubjectDto = {
        name: subjectTest.name,
        subjectCode: subjectTest.subjectCode,
        type: subjectTest.type,
        numberOfCredits: subjectTest.numberOfCredits,
        theoryCredits: subjectTest.theoryCredits,
        practiceCredits: subjectTest.practiceCredits,
        projectCredits: subjectTest.projectCredits,
        note: subjectTest.note,
      };
      await expect(controller.createSubject(newSubjectDto)).resolves.toEqual({
        id: 'a uuid 1',
        createdAt: subjectTest.createdAt,
        updatedAt: subjectTest.createdAt,
        ...newSubjectDto,
      });
    });
  });

  describe('updateSubject', () => {
    it('should update a subject', async () => {
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
      await expect(
        controller.updateSubject('a uuid 1', updateDto),
      ).resolves.toEqual({
        id: 'a uuid 1',
        ...subjectUpdatedTest,
      });
    });
  });

  describe('deleteSubject', () => {
    it('should delete a subject', async () => {
      await expect(
        controller.deleteSubject('a uuid that exists'),
      ).resolves.toEqual(undefined);
    });
  });

  describe('getSubjects', () => {
    it('should get an array of subjects', async () => {
      const getClassDto: GetSubjectDto = {
        page: 0,
        pageSize: 10,
      };
      await expect(controller.getSubject(getClassDto)).resolves.toEqual({
        results: subjectArray,
        count: subjectArray.length,
      });
    });
  });
});
