import type { RoleEnum } from '@/api/types';

export const USER_ROLES = {
  NEW: 'NEW',
  WAIT: 'WAIT',
  USER: 'USER',
  ADMIN: 'ADMIN',
  REJECT: 'REJECT',
  COACH: 'COACH',
  WITHDRAWAL: 'WITHDRAWAL',
} as const satisfies Record<string, RoleEnum>;

export const APPROVED_ROLES: ReadonlySet<RoleEnum> = new Set([
  USER_ROLES.USER,
  USER_ROLES.ADMIN,
  USER_ROLES.COACH,
]);
