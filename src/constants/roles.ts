import type { RoleEnum } from '@/api/types';

export const APPROVED_ROLES: ReadonlySet<RoleEnum> = new Set([
  'ROLE_USER',
  'ROLE_ADMIN',
  'ROLE_COACH',
]);
