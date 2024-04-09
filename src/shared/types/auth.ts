import { Role } from '../constants';

export interface AuthPayload {
  sub: string;
  email: string;
  role: Role;
}
