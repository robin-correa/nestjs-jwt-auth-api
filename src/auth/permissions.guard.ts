import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UserService } from 'src/user/user.service';
import { GetAuthUserDto } from './dto/get-auth-user.dto';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const authUserData: GetAuthUserDto =
      await this.userService.findOneForAuthUser(+user.sub);

    const userPermissions = authUserData.permissions;
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
