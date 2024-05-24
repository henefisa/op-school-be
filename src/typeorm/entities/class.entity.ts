import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserClass } from './user-class.entity';

@Entity('classes')
export class Class extends BaseEntity {
  @Column()
  name: string;

  @Column()
  memberLimit: number;

  @OneToMany(() => UserClass, (userClass) => userClass.class)
  members: UserClass[];

  constructor(name: string, memberLimit: number) {
    super();
    this.name = name;
    this.memberLimit = memberLimit;
  }
}
