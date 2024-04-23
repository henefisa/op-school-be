import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';

@Module({
  imports: [UsersModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
