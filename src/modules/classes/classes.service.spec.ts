import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { FindManyOptions, In, Repository } from 'typeorm';
import { Class } from 'src/typeorm/entities/class.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { NotFoundException } from '@nestjs/common';
import { GetClassDto } from './dto/get-class.dto';
import { UserClass } from 'src/typeorm/entities/user-class.entity';
import { UsersService } from '../users/users.service';
import { AddMembersDto } from './dto/add-members.dto';
import { User } from 'src/typeorm/entities/user.entity';
import { RemoveMembersDto } from './dto/remove-members.dto';
import { GetMembersDto } from './dto/get-members.dto';

const oneClass = new Class('Class single', 1);
const classArray = [
  new Class('Class one', 1),
  new Class('Class two', 2),
  new Class('Class three', 3),
];
const userArray = [new User('a uuid'), new User('another uuid')];
const memberArray = userArray.map(
  (user) => new UserClass('class uuid', user.id),
);

describe('Classes Service', () => {
  let service: ClassesService;
  let repository: Repository<Class>;
  let userClassRepository: Repository<UserClass>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: getRepositoryToken(Class),
          useValue: {
            findAndCount: jest
              .fn()
              .mockResolvedValue([classArray, classArray.length]),
            findOneOrFail: jest.fn().mockResolvedValue(oneClass),
            create: jest.fn().mockReturnValue(oneClass),
            save: jest.fn().mockReturnValue(oneClass),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: getRepositoryToken(UserClass),
          useValue: {
            save: jest.fn().mockReturnValue(memberArray),
            delete: jest.fn().mockResolvedValue(true),
            findAndCount: jest
              .fn()
              .mockResolvedValue([memberArray, memberArray.length]),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getMany: jest
              .fn()
              .mockImplementation((_: FindManyOptions<User>) =>
                Promise.resolve(userArray),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
    repository = module.get<Repository<Class>>(getRepositoryToken(Class));
    userClassRepository = module.get<Repository<UserClass>>(
      getRepositoryToken(UserClass),
    );
  });

  it('ClassesService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOne', () => {
    it('should get a single class', () => {
      const repoSpy = jest.spyOn(repository, 'findOneOrFail');
      expect(service.getOne({ where: { id: 'a uuid' } })).resolves.toEqual(
        oneClass,
      );
      expect(repoSpy).toBeCalledWith({ where: { id: 'a uuid' } });
    });
    it('should throw an error', () => {
      const repoSpy = jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(
          new NotFoundException(ErrorMessageKey.ClassNotFound),
        );
      expect(
        service.getOne({ where: { id: 'a uuid not exists' } }),
      ).rejects.toEqual(new NotFoundException(ErrorMessageKey.ClassNotFound));
      expect(repoSpy).toBeCalledWith({ where: { id: 'a uuid not exists' } });
    });
  });

  describe('create', () => {
    it('should successfully create a class', () => {
      expect(
        service.create({
          name: oneClass.name,
          memberLimit: oneClass.memberLimit,
        }),
      ).resolves.toEqual(oneClass);
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.create).toBeCalledWith({
        name: oneClass.name,
        memberLimit: oneClass.memberLimit,
      });
      expect(repository.save).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should successfully update a class', async () => {
      const repoSpy = jest.spyOn(repository, 'findOneOrFail');
      const targetClass = await service.update('a uuid', {
        name: oneClass.name,
        memberLimit: oneClass.memberLimit,
      });
      expect(repoSpy).toBeCalledWith({ where: { id: 'a uuid' } });
      expect(targetClass).toEqual(oneClass);
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({
        name: oneClass.name,
        memberLimit: oneClass.memberLimit,
      });
    });
  });

  describe('delete', () => {
    it('should successfully delete a class', async () => {
      expect(service.delete('a uuid')).resolves.toEqual(undefined);
    });

    it('should throw a not found error', async () => {
      const repoSpy = jest
        .spyOn(repository, 'delete')
        .mockRejectedValueOnce(
          new NotFoundException(ErrorMessageKey.ClassNotFound),
        );
      expect(service.delete('a uuid not exists')).rejects.toEqual(
        new NotFoundException(ErrorMessageKey.ClassNotFound),
      );
      expect(repoSpy).toBeCalledWith({ id: 'a uuid not exists' });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });

  describe('getClasses', () => {
    it('should return an array of classes', async () => {
      const getClassDto: GetClassDto = {
        page: 0,
        pageSize: 10,
      };
      const classes = await service.getClasses(getClassDto);
      expect(classes).toEqual({
        results: classArray,
        count: classArray.length,
      });
    });
  });

  describe('getMembers', () => {
    it('should return an array of classes', async () => {
      const getMembersDto: GetMembersDto = {
        page: 0,
        pageSize: 10,
      };
      const classes = await service.getMembers('class uuid', getMembersDto);
      expect(classes).toEqual({
        results: memberArray,
        count: memberArray.length,
      });
    });
  });

  describe('addMembers', () => {
    it('should add members to class', async () => {
      const addMembersDto: AddMembersDto = {
        memberIds: ['a uuid', 'another uuid'],
      };
      const members = await service.addMembers('class uuid', addMembersDto);
      expect(members).toEqual({
        results: memberArray,
        count: memberArray.length,
      });
    });
  });

  describe('removeMembers', () => {
    it('should remove members from class', async () => {
      const userClassRepositorySpy = jest.spyOn(userClassRepository, 'delete');
      jest
        .spyOn(service, 'getOne')
        .mockResolvedValue(new Class('Class one', 10, 'class uuid'));
      const removeMembersDto: RemoveMembersDto = {
        memberIds: ['a uuid', 'another uuid'],
      };
      const members = await service.removeMembers(
        'class uuid',
        removeMembersDto,
      );
      expect(members).toEqual(undefined);
      expect(userClassRepositorySpy).toBeCalledTimes(1);
      expect(userClassRepositorySpy).toBeCalledWith({
        classId: 'class uuid',
        userId: In(removeMembersDto.memberIds),
      });
    });
  });
});
