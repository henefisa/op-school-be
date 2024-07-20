import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Field } from './field.entity';

@Entity('career_group')
export class CareerGroup extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'uuid' })
  fieldId: string;

  @Column()
  careerGroupCode: string;

  @JoinColumn({ name: 'fieldId' })
  @ManyToOne(() => Field)
  field: Field;
}