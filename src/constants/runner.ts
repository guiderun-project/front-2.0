import type { UserType } from '@/api/types';

export const RUNNER_TYPE_AVATAR_TYPE_BY_USER_TYPE = {
  VI: 'vi',
  GUIDE: 'guide',
} as const satisfies Record<UserType, 'guide' | 'vi'>;
