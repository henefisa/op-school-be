import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import dayjs from 'dayjs';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: {
      from: (value: string) => {
        return dayjs(value);
      },
      to: (value: dayjs.Dayjs) => {
        return value.toISOString();
      },
    },
  })
  createdAt: dayjs.Dayjs;

  @UpdateDateColumn({
    type: 'timestamptz',
    transformer: {
      from: (value: string) => {
        return dayjs(value);
      },
      to: (value: dayjs.Dayjs) => {
        return value.toISOString();
      },
    },
  })
  updatedAt: dayjs.Dayjs;
}
