// roles.decorator.ts
import { UserRoles } from '@modules/user/enums/roles.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'ROLES';
export const Roles = (role: UserRoles) => SetMetadata(ROLES_KEY, role);
