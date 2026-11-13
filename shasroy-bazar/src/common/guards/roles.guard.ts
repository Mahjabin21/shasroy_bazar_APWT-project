import {CanActivate,ExecutionContext,Injectable,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Find which roles are allowed for this route
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

    // Check the user's role
    return requiredRoles.includes(user?.role);
  }
}