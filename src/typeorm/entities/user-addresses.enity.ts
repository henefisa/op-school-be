import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('user_addresses')
export class UserAddress extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userAddresses)
  user: User;

  @Column()
  description: string;
}
