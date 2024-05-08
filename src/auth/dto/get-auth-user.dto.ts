import { User } from './../../user/entities/user.entity';

export class GetAuthUserDto {
  id: number;
  name: string;
  email: string;
  status: number;
  created_at: Date;
  updated_at: Date;
  roles: string[];
  permissions: string[];

  constructor(user: User, roles: string[], permissions: string[]) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.status = user.status;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
    this.roles = roles;
    this.permissions = permissions;
  }
}
