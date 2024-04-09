import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from 'src/shared/constants';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ enum: Role, type: 'enum' })
  role: Role;
}
