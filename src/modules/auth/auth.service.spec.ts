import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/typeorm/entities/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FindOneOptions } from 'typeorm';
import { LoginDto } from './dto';
import { UnauthorizedException } from '@nestjs/common';
import { ErrorMessageKey } from 'src/shared/error-messages';
import bcrypt from 'bcrypt';

describe('Auth Service', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getOne: jest.fn().mockImplementation((_: FindOneOptions<User>) =>
              Promise.resolve({
                email: 'a email',
                password: bcrypt.hashSync(
                  'simple password',
                  bcrypt.genSaltSync(),
                ),
                id: 'a uuid',
                role: 'a role',
              }),
            ),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest
              .fn()
              .mockImplementation((_payload: object | Buffer) =>
                Promise.resolve('a jwt'),
              ),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest
              .fn()
              .mockImplementation((_key: string) =>
                Promise.resolve('a secret'),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('AuthService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login', () => {
      const loginDto: LoginDto = {
        email: 'a email',
        password: 'simple password',
      };
      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
      expect(service.login(loginDto)).resolves.toEqual({
        accessToken: 'a jwt',
        refreshToken: 'a jwt',
      });
    });

    it('should throw invalid credentials error', () => {
      const loginDto: LoginDto = { email: 'a email', password: 'a password' };
      const bcryptCompare = jest.fn().mockResolvedValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
      expect(service.login(loginDto)).rejects.toEqual(
        new UnauthorizedException(ErrorMessageKey.InvalidCredentials),
      );
    });

    it('should throw invalid credentials if user not found', () => {
      const usersServiceSpy = jest
        .spyOn(usersService, 'getOne')
        .mockRejectedValue(
          new UnauthorizedException(ErrorMessageKey.InvalidCredentials),
        );
      const loginDto: LoginDto = { email: 'a email', password: 'a password' };
      expect(service.login(loginDto)).rejects.toEqual(
        new UnauthorizedException(ErrorMessageKey.InvalidCredentials),
      );
      expect(usersServiceSpy).toBeCalledTimes(1);
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token', () => {
      const user = new User('a uuid');

      expect(service.refreshToken(user)).resolves.toEqual({
        accessToken: 'a jwt',
        refreshToken: 'a jwt',
      });
    });
  });
});
