import type { EventDetailResponse, RoleEnum, UserInfoGetResponse } from '@/api/types';
import { USER_ROLES } from '@/constants/roles';

type EventDetailPermissionParams = {
  event: EventDetailResponse;
  user: UserInfoGetResponse | null;
};

export const EVENT_OPERATION_MANAGER_ROLES = [
  USER_ROLES.ADMIN,
  USER_ROLES.COACH,
] as const satisfies readonly RoleEnum[];

export const EVENT_POST_MANAGER_ROLES = [
  USER_ROLES.ADMIN,
] as const satisfies readonly RoleEnum[];

const EVENT_OPERATION_MANAGER_ROLE_SET: ReadonlySet<RoleEnum> = new Set(
  EVENT_OPERATION_MANAGER_ROLES,
);
const EVENT_POST_MANAGER_ROLE_SET: ReadonlySet<RoleEnum> = new Set(
  EVENT_POST_MANAGER_ROLES,
);

export const isEventOrganizer = (event: EventDetailResponse): boolean =>
  event.viewer?.isOrganizer === true;

export const hasEventOperationManagerRole = (
  user: UserInfoGetResponse | null,
): boolean => (user ? EVENT_OPERATION_MANAGER_ROLE_SET.has(user.role) : false);

export const hasEventPostManagerRole = (
  user: UserInfoGetResponse | null,
): boolean => (user ? EVENT_POST_MANAGER_ROLE_SET.has(user.role) : false);

export const canManageEventOperations = ({
  event,
  user,
}: EventDetailPermissionParams): boolean =>
  isEventOrganizer(event) || hasEventOperationManagerRole(user);

export const canManageEventPost = ({
  event,
  user,
}: EventDetailPermissionParams): boolean =>
  isEventOrganizer(event) || hasEventPostManagerRole(user);
