import { MY_ACTIVITY_PARTNER_SORTS } from '@/api/constants/user';
import type { MyActivityPartnerSort } from '@/api/types';
import type { SelectOptions } from '@/components';

export const LOADING_MESSAGE = '함께 달린 파트너를 불러오는 중이에요.';
export const ERROR_MESSAGE = '함께 달린 파트너를 불러오지 못했어요.';
export const PARTNER_EVENT_DISPLAY_LIMIT = 5;

export const PARTNER_SORT_OPTIONS = [
  { label: '최근순', value: MY_ACTIVITY_PARTNER_SORTS.RECENT },
  { label: '과거순', value: MY_ACTIVITY_PARTNER_SORTS.OLD },
] as const satisfies SelectOptions<MyActivityPartnerSort>;
