import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { Class } from 'src/typeorm/entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { GetClassDto } from './dto/get-class.dto';

const oneClass = new Class('Single Class', 1);
const classArray = [
  new Class('Class one', 1),
  new Class('Class two', 2),
  new Class('Class three', 3),
];

describe('Classes Controller', () => {
  let controller: ClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesController],
      providers: [
        {
          provide: ClassesService,
          useValue: {
            getMany: jest.fn().mockImplementation((_: GetClassDto) =>
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

  describe('getMany', () => {
    it('should get an array of cats', async () => {
      const getClassDto: GetClassDto = {
        page: 0,
        pageSize: 10,
      };
      await expect(controller.getMany(getClassDto)).resolves.toEqual({
        results: classArray,
        count: classArray.length,
      });
    });
  });
});
