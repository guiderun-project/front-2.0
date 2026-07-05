import type { UserInfoGetResponse } from '@/api/types';
import { USER_ROLES } from '@/constants/roles';

import {
  EVENT_OPERATION_MANAGER_ROLES,
  EVENT_POST_MANAGER_ROLES,
  canManageEventOperations,
  canManageEventPost,
  hasEventOperationManagerRole,
  hasEventPostManagerRole,
  isEventOrganizer,
} from './eventDetailPermissions';

type Assert<T extends true> = T;
type Equal<Left, Right> =
  (<T>() => T extends Left ? 1 : 2) extends
  (<T>() => T extends Right ? 1 : 2)
    ? true
    : false;

type OperationManagerRole = (typeof EVENT_OPERATION_MANAGER_ROLES)[number];
type PostManagerRole = (typeof EVENT_POST_MANAGER_ROLES)[number];
type EventPermissionParams = Parameters<typeof canManageEventOperations>[0];

export type OperationManagersAreCoachAndAdmin = Assert<
  Equal<OperationManagerRole, typeof USER_ROLES.ADMIN | typeof USER_ROLES.COACH>
>;

export type PostManagersAreAdmin = Assert<
  Equal<PostManagerRole, typeof USER_ROLES.ADMIN>
>;

export type EventPermissionParamsAcceptsNullableUser = Assert<
  Equal<EventPermissionParams['user'], UserInfoGetResponse | null>
>;

export const EVENT_OPERATION_MANAGER_ROLE_LIST =
  EVENT_OPERATION_MANAGER_ROLES satisfies readonly [
    typeof USER_ROLES.ADMIN,
    typeof USER_ROLES.COACH,
  ];

export const EVENT_POST_MANAGER_ROLE_LIST =
  EVENT_POST_MANAGER_ROLES satisfies readonly [typeof USER_ROLES.ADMIN];

export const EVENT_DETAIL_PERMISSION_HELPERS = {
  canManageEventOperations,
  canManageEventPost,
  hasEventOperationManagerRole,
  hasEventPostManagerRole,
  isEventOrganizer,
};
