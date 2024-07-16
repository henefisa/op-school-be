import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { GetUsersDto } from './dto/get-users.dto';
import { BaseService } from 'src/shared/base.service';
import { EntityName } from 'src/shared/error-messages';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(EntityName.User, userRepository);
  }

  async getMany(options: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }

  async findAll(dto: GetUsersDto) {
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
