import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Class } from './class.entity';
import { Result } from './result.entity';

@Entity('user_classes')
export class UserClass extends BaseEntity {
  @Column({ type: 'uuid' })
  classId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User)
  user: User;

  @JoinColumn({ name: 'classId' })
  @ManyToOne(() => Class)
  class: Class;

  @OneToMany(() => Result, (result) => result.userClass)
  results: Result[];
}
