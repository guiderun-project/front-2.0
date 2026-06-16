import type { RoleEnum } from '@/api/types';

export const USER_ROLES = {
  NEW: 'ROLE_NEW',
  WAIT: 'ROLE_WAIT',
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
  REJECT: 'ROLE_REJECT',
  COACH: 'ROLE_COACH',
  WITHDRAWAL: 'ROLE_WITHDRAWAL',
} as const satisfies Record<string, RoleEnum>;

export const APPROVED_ROLES: ReadonlySet<RoleEnum> = new Set([
  USER_ROLES.USER,
  USER_ROLES.ADMIN,
  USER_ROLES.COACH,
]);
