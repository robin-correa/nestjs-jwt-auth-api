import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { LoginRequestDto } from './dto/login-request.dto';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByEmail(loginRequest.email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await this.isPasswordCorrect(loginRequest, user);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const tokenResponse = {
      token_type: 'Bearer',
      access_token: await this.generateAccessToken(user),
      refresh_token: await this.generateRefreshToken(user),
      expires_in: +process.env.JWT_ACCESS_TOKEN_EXPIRY_IN_SECONDS,
    };

    return new LoginResponseDto(tokenResponse);
  }

  async refresh(
    refreshTokenRequest: RefreshTokenRequestDto,
  ): Promise<TokenResponseDto> {
    const tokenPayload = await this.jwtService.verifyAsync(
      refreshTokenRequest.refresh_token,
      {
        secret: process.env.JWT_SECRET_KEY,
      },
    );

    if (tokenPayload.token_type !== 'refresh') {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findUserById(tokenPayload.sub);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const tokenResponse = {
      token_type: 'Bearer',
      access_token: await this.generateAccessToken(user),
      refresh_token: await this.generateRefreshToken(user),
      expires_in: +process.env.JWT_ACCESS_TOKEN_EXPIRY_IN_SECONDS,
    };

    return new LoginResponseDto(tokenResponse);
  }

  private async isPasswordCorrect(
    request: LoginRequestDto,
    user: User,
  ): Promise<boolean> {
    return await bcrypt.compare(request.password, user?.password);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      jti: uuid.v4(),
      token_type: 'access',
    };

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h',
    });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      jti: uuid.v4(),
      token_type: 'refresh',
    };

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1d',
    });
  }
}
