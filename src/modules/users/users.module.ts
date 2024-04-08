import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [],
  exports: [],
})
export class UsersModule {}
