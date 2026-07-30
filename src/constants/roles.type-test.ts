import type { RoleEnum } from '@/api/types';
import { USER_ROLES } from '@/constants/roles';

type Assert<T extends true> = T;
type Equal<Left, Right> =
  (<T>() => T extends Left ? 1 : 2) extends
  (<T>() => T extends Right ? 1 : 2)
    ? true
    : false;

type V1RoleEnum =
  | 'NEW'
  | 'REJECT'
  | 'WAIT'
  | 'USER'
  | 'COACH'
  | 'ADMIN'
  | 'WITHDRAWAL';

export type RoleEnumMatchesV1Values = Assert<Equal<RoleEnum, V1RoleEnum>>;

export const USER_ROLES_MATCH_V1_VALUES = USER_ROLES satisfies Record<
  string,
  V1RoleEnum
>;
