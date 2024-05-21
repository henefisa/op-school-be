import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserClass } from './user-class.entity';
import { ResultType } from 'src/shared/constants';

@Entity('results')
export class Result extends BaseEntity {
  @Column({ type: 'enum', enum: ResultType, default: ResultType.Other })
  type: ResultType;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'integer', default: 0 })
  score: number;

  @Column({ type: 'uuid' })
  userClassId: string;

  @JoinColumn({ name: 'userClassId' })
  @ManyToOne(() => UserClass)
  userClass: UserClass;
}
