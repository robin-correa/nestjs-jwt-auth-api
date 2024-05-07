import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Global,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { SKIP_AUTH } from './skipauth.decorator';

@Injectable()
@Global()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      if (!token) {
        throw new UnauthorizedException();
      }
      const tokenPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (tokenPayload.token_type !== 'access') {
        throw new ForbiddenException();
      }

      request['user'] = tokenPayload;
      return true;
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('Token expired');
        case 'JsonWebTokenError':
          throw new BadRequestException('Token is invalid');

        default:
          console.error(e);
          throw e;
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
