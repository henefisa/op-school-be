import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessageKey } from 'src/shared';
import { User } from 'src/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getOne(options: FindOneOptions<User>) {
    return await this.userRepository.findOneOrFail(options).catch(() => {
      throw new BadRequestException(ErrorMessageKey.UserNotFound);
    });
  }
}