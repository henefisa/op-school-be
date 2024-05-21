import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User)
  user: User;

  @Column()
  description: string;
}
