import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Department } from './department.entity';

@Entity('careers')
export class Career extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'uuid' })
  departmentId: string;

  @Column()
  careerCode: string;

  @JoinColumn({ name: 'departmentId' })
  @ManyToOne(() => Department)
  department: Department;
}
