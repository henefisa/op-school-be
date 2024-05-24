import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/typeorm/entities/class.entity';
import { UserClass } from 'src/typeorm/entities/user-class.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Class, UserClass]), UsersModule],
  providers: [ClassesService],
  controllers: [ClassesController],
  exports: [ClassesService],
})
export class ClassesModule {}
