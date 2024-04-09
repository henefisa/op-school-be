import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { User } from 'src/typeorm/entities/user.entity';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto';
import bcrypt from 'bcrypt';

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

  async changePassword(user: User, dto: ChangePasswordDto) {
    if (dto.newPassword === dto.oldPassword) {
      throw new BadRequestException(
        ErrorMessageKey.NewPasswordAndOldPasswordAreTheSame,
      );
    }

    const currentUser = await this.getOne({
      where: { email: ILike(user.email) },
      select: {
        id: true,
        password: true,
      },
    }).catch(() => {
      throw new BadRequestException(ErrorMessageKey.UserNotFound);
    });

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      currentUser.password,
    );

    if (!isOldPasswordValid) {
      throw new BadRequestException(ErrorMessageKey.InvalidOldPassword);
    }

    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      await bcrypt.genSalt(),
    );

    currentUser.password = hashedPassword;
    await this.userRepository.save(currentUser);
    delete currentUser.password;

    return {
      message: 'Password updated',
    };
  }
}
