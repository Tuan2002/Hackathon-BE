// rbac.guard.ts
import { UserRoles } from '@modules/user/enums/roles.enum';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the role from the route metadata
    const role =
      this.reflector.get<UserRoles>(ROLES_KEY, context.getHandler()) ||
      this.reflector.get<UserRoles>(ROLES_KEY, context.getClass());

    if (!role) {
      return true; // If no role is specified, allow the request (you can change this logic as needed)
    }

    const request = context.switchToHttp().getRequest();
    // Assuming user is attached to the request (e.g., via JWT)
    const user = request.user;
    const hasRole = user?.role === role; // Check if the user's role matches the required role
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }
}
