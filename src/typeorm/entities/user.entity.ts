import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import dayjs from 'dayjs';
import { Role } from 'src/shared';

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

  @Column({
    type: 'date',
    transformer: {
      from: (value: string) => {
        return dayjs(value);
      },
      to: (value: dayjs.Dayjs) => {
        return value.toISOString();
      },
    },
  })
  birthday: dayjs.Dayjs;

  @Column({ enum: Role, type: 'enum' })
  role: Role;
}
