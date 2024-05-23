import { User } from 'src/typeorm/entities/user.entity';

declare module 'express' {
  export interface Request {
    user: User;
  }
}
