import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { Class } from 'src/typeorm/entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { GetClassDto } from './dto/get-class.dto';
import { GetMembersDto } from './dto/get-members.dto';
import { User } from 'src/typeorm/entities/user.entity';
import { UserClass } from 'src/typeorm/entities/user-class.entity';
import { AddMembersDto } from './dto/add-members.dto';
import { RemoveMembersDto } from './dto/remove-members.dto';

const oneClass = new Class('Single Class', 1);
const classArray = [
  new Class('Class one', 1),
  new Class('Class two', 2),
  new Class('Class three', 3),
];
const userArray = [new User('a uuid'), new User('another uuid')];
const memberArray = userArray.map(
  (user) => new UserClass('class uuid', user.id),
);

describe('Classes Controller', () => {
  let controller: ClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesController],
      providers: [
        {
          provide: ClassesService,
          useValue: {
            getClasses: jest.fn().mockImplementation((_: GetClassDto) =>
              Promise.resolve({
                results: classArray,
                count: classArray.length,
              }),
            ),
            getOne: jest
              .fn()
              .mockImplementation((options: FindOneOptions<Class>) =>
                Promise.resolve({
                  ...oneClass,
                  id: (options.where as FindOptionsWhere<Class>).id,
                }),
              ),
            create: jest
              .fn()
              .mockImplementation((dto: CreateClassDto) =>
                Promise.resolve({ id: 'a uuid', ...dto }),
              ),
            update: jest
              .fn()
              .mockImplementation((id: string, dto: UpdateClassDto) =>
                Promise.resolve({ id, ...dto }),
              ),
            delete: jest.fn().mockResolvedValue(undefined),
            getMembers: jest
              .fn()
              .mockImplementation((_classId: string, _dto: GetMembersDto) =>
                Promise.resolve({
                  results: memberArray,
                  count: memberArray.length,
                }),
              ),
            addMembers: jest
              .fn()
              .mockImplementation((_classId: string, _dto: AddMembersDto) =>
                Promise.resolve({
                  results: memberArray,
                  count: memberArray.length,
                }),
              ),
            removeMembers: jest
              .fn()
              .mockImplementation((_classId: string, _dto: RemoveMembersDto) =>
                Promise.resolve(undefined),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<ClassesController>(ClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getById', () => {
    it('should get a single class', async () => {
      await expect(controller.getById('a strange id')).resolves.toEqual({
        name: oneClass.name,
        memberLimit: oneClass.memberLimit,
        id: 'a strange id',
      });
      await expect(controller.getById('a different id')).resolves.toEqual({
        name: oneClass.name,
        memberLimit: oneClass.memberLimit,
        id: 'a different id',
      });
    });
  });

  describe('newClass', () => {
    it('should create a new class', async () => {
      const newClassDto: CreateClassDto = {
        name: 'Class New',
        memberLimit: 10,
      };
      await expect(controller.createClass(newClassDto)).resolves.toEqual({
        id: 'a uuid',
        ...newClassDto,
      });
    });
  });

  describe('updateClass', () => {
    it('should update a new class', async () => {
      const updateClassDto: CreateClassDto = {
        name: 'Class New',
        memberLimit: 10,
      };
      await expect(
        controller.updateClass('a uuid', updateClassDto),
      ).resolves.toEqual({
        id: 'a uuid',
        ...updateClassDto,
      });
    });
  });

  describe('deleteClass', () => {
    it('should delete a class', async () => {
      await expect(
        controller.deleteClass('a uuid that exists'),
      ).resolves.toEqual(undefined);
    });
  });

  describe('getClasses', () => {
    it('should get an array of classes', async () => {
      const getClassDto: GetClassDto = {
        page: 0,
        pageSize: 10,
      };
      await expect(controller.getClasses(getClassDto)).resolves.toEqual({
        results: classArray,
        count: classArray.length,
      });
    });
  });

  describe('getMembers', () => {
    it('should get an array of members', async () => {
      const getMembersDto: GetMembersDto = {
        page: 0,
        pageSize: 10,
      };
      await expect(
        controller.getMembers('class uuid', getMembersDto),
      ).resolves.toEqual({
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
      const members = await controller.addMembers('class uuid', addMembersDto);
      expect(members).toEqual({
        results: memberArray,
        count: memberArray.length,
      });
    });
  });

  describe('removeMembers', () => {
    it('should remove members from class', async () => {
      const removeMembersDto: RemoveMembersDto = {
        memberIds: ['a uuid', 'another uuid'],
      };
      const members = await controller.removeMembers(
        'class uuid',
        removeMembersDto,
      );
      expect(members).toEqual(undefined);
    });
  });
});
