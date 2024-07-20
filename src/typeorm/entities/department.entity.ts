import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('departments')
export class Department extends BaseEntity {
  @Column()
  name: string;
}
