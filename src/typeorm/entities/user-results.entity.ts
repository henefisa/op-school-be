import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { UserClass } from './user-classes.entity';

@Entity('user_results')
export class UserResult extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.userResults)
  user: User;

  @ManyToOne(() => UserClass, (userClass) => userClass.userResults)
  userClass: UserClass;
}
