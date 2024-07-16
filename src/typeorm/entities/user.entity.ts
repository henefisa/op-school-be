import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Gender, Role } from 'src/shared/constants';
import { UserImage } from './user-image.entity';
import { UserClass } from './user-class.entity';
import { Address } from './address.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ enum: Role, type: 'enum' })
  role: Role;

  @Column({ enum: Gender, type: 'enum', nullable: true })
  gender: Gender;

  @Column({ nullable: true, type: 'uuid' })
  parentId: string;

  @OneToMany(() => UserImage, (image) => image.user)
  images: string;

  @OneToMany(() => UserClass, (userClass) => userClass.user)
  userClasses: UserClass;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
