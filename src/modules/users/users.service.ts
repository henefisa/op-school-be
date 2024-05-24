import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { User } from 'src/typeorm/entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getOne(options: FindOneOptions<User>) {
    return await this.userRepository.findOneOrFail(options).catch(() => {
      throw new NotFoundException(ErrorMessageKey.UserNotFound);
    });
  }

  async getMany(options: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }

  async getUsers(dto: GetUsersDto) {
    const [results, count] = await this.userRepository.findAndCount({
      where: {
        role: dto.role,
      },
      skip: (dto.page - 1) * dto.pageSize,
      take: dto.pageSize,
    });

    return {
      results,
      count,
    };
  }
}
