import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { Skipauth } from './skipauth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Skipauth()
  @Post('login')
  async login(@Body() loginRequest: LoginRequestDto) {
    return await this.authService.login(loginRequest);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenRequestDto: RefreshTokenRequestDto) {
    return await this.authService.refresh(refreshTokenRequestDto);
  }

  @Get('user')
  async user(@Request() request: Request) {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    return await this.authService.getAuthUserByToken(token);
  }
}
