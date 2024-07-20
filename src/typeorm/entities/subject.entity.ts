import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SubjectType } from 'src/shared/constants';

@Entity('subjects')
export class Subject extends BaseEntity {
  @Column()
  subjectCode: string;

  @Column({ type: 'enum', enum: SubjectType, default: SubjectType.THEORY })
  type: SubjectType;

  @Column()
  name: string;

  @Column({ type: 'integer', default: 1 })
  numberOfCredits: number;

  @Column({ type: 'integer', default: 0 })
  theoryCredits: number;

  @Column({ type: 'integer', default: 0 })
  practiceCredits: number;

  @Column({ type: 'integer', default: 0 })
  projectCredits: number;

  @Column()
  note: string;

  @Column({ type: 'timestamptz', nullable: true })
  startTime?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishTime?: Date;
}
