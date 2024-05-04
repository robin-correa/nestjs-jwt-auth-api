import { User } from '../entities/user.entity';

export class GetUserDto {
  id: number;
  name: string;
  email: string;
  status: number;
  created_at: Date;
  updated_at: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.status = user.status;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }
}
