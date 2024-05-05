import { Permission } from 'src/entities/permission.entity';
import { Role } from '../entities/role.entity';

export class GetRoleDto {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  permissions: Permission[];

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.created_at = role.created_at;
    this.updated_at = role.updated_at;
    this.permissions = role.permissions;
  }
}
