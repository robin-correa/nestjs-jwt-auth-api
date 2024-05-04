import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthGuard } from './auth.guard';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequestDto) {
    return await this.authService.login(loginRequest);
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  async refresh(@Body() refreshTokenRequestDto: RefreshTokenRequestDto) {
    return await this.authService.refresh(refreshTokenRequestDto);
  }
}
