import {
  EVENT_CATEGORIES,
  EVENT_LIST_TABS,
  EVENT_LIST_TYPE_FILTERS,
  EVENT_TYPES,
  RECRUIT_STATUS_FILTERS,
} from '@/api/constants/common';

type ValueOf<T> = T[keyof T];

export type UserType = 'VI' | 'GUIDE';
export type DisabilityType = UserType;
export type Gender = 'MALE' | 'FEMALE';
export type RunningGroup = 'A' | 'B' | 'C' | 'D' | 'E' | 'P';
export type EventType = ValueOf<typeof EVENT_TYPES>;
export type EventCategory = ValueOf<typeof EVENT_CATEGORIES>;

export type EventListTab = ValueOf<typeof EVENT_LIST_TABS>;

export type EventListTypeFilter = ValueOf<typeof EVENT_LIST_TYPE_FILTERS>;

export type RecruitStatus =
  | 'RECRUIT_UPCOMING'
  | 'RECRUIT_OPEN'
  | 'RECRUIT_CLOSE'
  | 'RECRUIT_END';

export type RecruitStatusFilter = ValueOf<typeof RECRUIT_STATUS_FILTERS>;

export type RoleEnum =
  | 'NEW'
  | 'WAIT'
  | 'USER'
  | 'ADMIN'
  | 'REJECT'
  | 'COACH'
  | 'WITHDRAWAL';

export type AdditionalQuestionType = 'TEXT' | 'SELECT';

export type Pagination = {
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
};

export type PageInfo = Omit<Pagination, 'hasNext'>;
