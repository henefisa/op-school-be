import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserClass } from './user-classes.entity';

@Entity('classes')
export class Class extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => UserClass, (userClass) => userClass.class)
  userClasses: UserClass;
}
