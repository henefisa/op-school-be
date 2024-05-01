import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForgotPasswordDto, LoginDto } from './dto';
import { ILike } from 'typeorm';
import bcrypt from 'bcrypt';
import { ErrorMessageKey } from 'src/shared/error-messages';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayload } from 'src/@types';
import { UsersService } from '../users/users.service';
import { User } from 'src/typeorm/entities/user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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

    const authPayload: AuthPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(authPayload),
      refreshToken: await this.jwtService.signAsync(authPayload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
      }),
    };
  }

  async refreshToken(user: User) {
    const authPayload: AuthPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(authPayload),
      refreshToken: await this.jwtService.signAsync(authPayload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
      }),
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.getOne({
      where: {
        email: ILike(dto.email),
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
      },
    });

    const authPayload: AuthPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const jwtToken = await this.jwtService.signAsync(authPayload);
    const forgotPasswordUrl = `${this.configService.getOrThrow(
      'BASE_URL',
    )}/auth/reset-password?token=${jwtToken}`;

    await this.mailService.sendRequestResetPassword(user, forgotPasswordUrl);

    return {
      message: 'Forgot password requested',
    };
  }
}
