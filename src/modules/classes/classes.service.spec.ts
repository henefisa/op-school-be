import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { Repository } from 'typeorm';
import { Class } from 'src/typeorm/entities/class.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { NotFoundException } from '@nestjs/common';
import { GetClassDto } from './dto/get-class.dto';

const oneClass = new Class('Class single', 1);
const classArray = [
  new Class('Class one', 1),
  new Class('Class two', 2),
  new Class('Class three', 3),
];

describe('Classes Service', () => {
  let service: ClassesService;
  let repository: Repository<Class>;

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
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
    repository = module.get<Repository<Class>>(getRepositoryToken(Class));
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

  describe('getMany', () => {
    it('should return an array of classes', async () => {
      const getClassDto: GetClassDto = {
        page: 0,
        pageSize: 10,
      };
      const classes = await service.getMany(getClassDto);
      expect(classes).toEqual({
        results: classArray,
        count: classArray.length,
      });
    });
  });
});
