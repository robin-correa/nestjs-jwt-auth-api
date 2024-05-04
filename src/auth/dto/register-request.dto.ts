import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { PasswordMatch } from 'src/user/dto/password-match.decorator';

export class RegisterRequestDto {
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
}
