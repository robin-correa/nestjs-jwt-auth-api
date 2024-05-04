import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { PasswordMatch } from './password-match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @PasswordMatch('password', { message: 'Passwords must match' })
  password_confirm: string;

  @IsNotEmpty()
  status: number;
}
