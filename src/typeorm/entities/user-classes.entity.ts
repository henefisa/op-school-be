import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Class } from './classes.entiy';
import { UserResult } from './user-results.entity';

@Entity('user_classes')
export class UserClass extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userClasses)
  user: User;

  @ManyToOne(() => Class, (classes) => classes.userClasses)
  class: Class;

  @OneToMany(() => UserResult, (userResult) => userResult.userClass)
  userResults: UserResult;
}
