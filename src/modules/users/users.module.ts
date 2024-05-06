import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserImage } from 'src/typeorm/entities/user-images.entity';
import { UserClass } from 'src/typeorm/entities/user-classes.entity';
import { UserResult } from 'src/typeorm/entities/user-results.entity';
import { UserAddress } from 'src/typeorm/entities/user-addresses.enity';
import { Class } from 'src/typeorm/entities/classes.entiy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserImage,
      UserClass,
      UserResult,
      UserAddress,
      Class,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
