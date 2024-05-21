import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('user_images')
export class UserImage extends BaseEntity {
  @ManyToOne(() => User, (user) => user.images)
  user: User;

  @Column()
  url: string;
}
