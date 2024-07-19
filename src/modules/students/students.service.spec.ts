import { User } from 'src/typeorm/entities/user.entity';
import { StudentsService } from './students.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender, Role } from 'src/shared/constants';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { GetStudentsDto } from './dto/get-students.dto';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import { EntityName } from 'src/shared/error-messages';

const today = new Date();

const createStudent = (studentId: string) => {
  const student = new User();
  student.id = studentId;
  student.email = `example123-${studentId}@gmail.com`;
  student.birthday = today;
  student.firstName = 'firstName';
  student.lastName = 'lastName';
  student.middleName = 'middleName';
  student.gender = Gender.Female;
  student.nickname = 'nickname';
  student.role = Role.Student;

  return student;
};

const oneStudent = createStudent('auuid');
const arrayStudent = [...Array(3)].map((_, index) => createStudent(`${index}`));

describe('Students Service', () => {
  let service: StudentsService;
  let repository: Repository<User>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: UsersService,
          useValue: {
            getOne: jest.fn().mockRejectedValue(null),
            getOneOrThrow: jest.fn().mockRejectedValue(null),
            findAll: jest
              .fn()
              .mockResolvedValue([arrayStudent, arrayStudent.length]),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(oneStudent),
            save: jest.fn().mockResolvedValue(oneStudent),
            delete: jest.fn().mockResolvedValue(undefined),
            findOne: jest.fn().mockResolvedValue(oneStudent),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    usersService = module.get<UsersService>(UsersService);
  });

  it('StudentService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isEmailAvailable', () => {
    it('isEmailAvailable should be return true', async () => {
      const usersServiceSpy = jest
        .spyOn(usersService, 'getOne')
        .mockResolvedValue(oneStudent);

      const isEmailAvailable = await service.isEmailAvailable(
        'example123-auuid@gmail.com',
      );

      expect(isEmailAvailable).toEqual(true);
      expect(usersServiceSpy).toBeCalledTimes(1);
    });

    it('isEmailAvailable should be return true', async () => {
      const usersServiceSpy = jest
        .spyOn(usersService, 'getOne')
        .mockResolvedValue(null);

      const isEmailAvailable = await service.isEmailAvailable(
        'example123-auuid@gmail.com',
      );

      expect(isEmailAvailable).toEqual(false);
      expect(usersServiceSpy).toBeCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should successfully create a student', async () => {
      const usersServiceSpy = jest
        .spyOn(usersService, 'getOne')
        .mockResolvedValue(null);

      const result = await service.create({
        birthday: today,
        email: 'example123-auuid@gmail.com',
        firstName: 'firstName',
        gender: Gender.Female,
        lastName: 'lastName',
        middleName: 'middleName',
        nickname: 'nickname',
        password: 'abcd@1234',
      });

      expect(result).toEqual(oneStudent);
      expect(repository.save).toBeCalledTimes(1);
      expect(usersServiceSpy).toBeCalledTimes(1);
    });

    it('should throw an error student already exist', () => {
      const usersServiceSpy = jest
        .spyOn(usersService, 'getOne')
        .mockResolvedValue(oneStudent);

      expect(
        service.create({
          birthday: today,
          email: 'example123-auuid@gmail.com',
          firstName: 'firstName',
          gender: Gender.Female,
          lastName: 'lastName',
          middleName: 'middleName',
          nickname: 'nickname',
          password: 'abcd@1234',
        }),
      ).rejects.toEqual(new BadRequestException('Student already exist.'));
      expect(usersServiceSpy).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const getStudentsDto: GetStudentsDto = {
        page: 0,
        pageSize: 10,
      };

      const students = await service.findAll(getStudentsDto);
      expect(students).toEqual([arrayStudent, arrayStudent.length]);
    });
  });

  describe('update', () => {
    it('should successfully update a student', async () => {
      const student = await service.update('auuid', {
        firstName: oneStudent.firstName,
      });

      expect(student).toEqual(oneStudent);
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(oneStudent);
    });

    it('should throw an error not found', async () => {
      const repositorySpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(null);

      expect(
        service.update('auuid', {
          firstName: oneStudent.firstName,
        }),
      ).rejects.toEqual(new NotFoundException(EntityName.User));
      expect(repositorySpy).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should successfully delete a student', async () => {
      expect(service.delete('auuid')).resolves.toEqual(undefined);
    });
  });
});
