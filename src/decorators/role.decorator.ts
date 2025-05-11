import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'ROLES';

export const Roles = (roles: string[]) => SetMetadata(ROLES_KEY, roles);
