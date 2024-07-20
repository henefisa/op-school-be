import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('fields')
export class Field extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'integer', default: 0 })
  type: number;

  @Column()
  fieldCode: string;
}
