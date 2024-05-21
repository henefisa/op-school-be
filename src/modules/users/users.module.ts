import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserImage } from 'src/typeorm/entities/user-image.entity';
import { UserClass } from 'src/typeorm/entities/user-class.entity';
import { Result } from 'src/typeorm/entities/result.entity';
import { Address } from 'src/typeorm/entities/address.entity';
import { Class } from 'src/typeorm/entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserImage,
      UserClass,
      Result,
      Address,
      Class,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
