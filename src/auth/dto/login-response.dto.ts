import { TokenResponseDto } from './token-response.dto';

export class LoginResponseDto {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;

  constructor(tokenResponseObj: TokenResponseDto) {
    this.token_type = tokenResponseObj.token_type;
    this.access_token = tokenResponseObj.access_token;
    this.refresh_token = tokenResponseObj.refresh_token;
    this.expires_in = tokenResponseObj.expires_in;
  }
}
