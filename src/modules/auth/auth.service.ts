import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users';
import { LoginDto } from './dto';
import { ILike } from 'typeorm';
import bcrypt from 'bcrypt';
import { ErrorMessageKey } from 'src/shared';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService
      .getOne({
        where: { email: ILike(dto.email) },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        },
      })
      .catch(() => {
        throw new UnauthorizedException(ErrorMessageKey.InvalidCredentials);
      });

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(ErrorMessageKey.InvalidCredentials);
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
