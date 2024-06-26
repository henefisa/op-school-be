import { Role } from '../shared/constants';

export interface AuthPayload {
  sub: string;
  email: string;
  role: Role;
}
