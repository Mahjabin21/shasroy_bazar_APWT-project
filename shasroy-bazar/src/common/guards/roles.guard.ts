import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // Get required roles from the route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      'roles',
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // If no role is specified, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get authenticated user information
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check role
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }

    // Check account type
    if (user.role === 'admin' && user.accountType !== 'administrator') {
      throw new ForbiddenException('Invalid administrator account');
    }

    if (user.role === 'user' && user.accountType !== 'user') {
      throw new ForbiddenException('Invalid user account');
    }

    if (user.role === 'merchant' && user.accountType !== 'merchant') {
      throw new ForbiddenException('Invalid merchant account');
    }

    return true;
  }
}
