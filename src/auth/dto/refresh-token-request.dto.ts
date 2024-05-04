import { IsString, IsNotEmpty } from 'class-validator';
export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
