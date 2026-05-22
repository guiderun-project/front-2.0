import {
  MY_ACTIVITY_EVENT_RELATION_FILTERS,
  MY_ACTIVITY_PARTNER_SORTS,
} from '@/api/constants/user';
import type {
  EventListTypeFilter,
  Gender,
  RunningGroup,
  RoleEnum,
  UserType,
} from './common';

type ValueOf<T> = T[keyof T];

export type UserInfoGetResponse = {
  name: string;
  gender: Gender;
  phoneNumber: string;
  birthDate: string | null;
  recordDegree: RunningGroup;
  snsId: string | null;
  id1365?: string | null;
  userId: string;
  role: RoleEnum;
  type: UserType;
};

export type UserBirthDatePatchRequest = {
  birthDate: string;
};

export type UserBirthDatePatchResponse = {
  birthDate: string;
};

export type MyPageResponse = {
  profile: {
    name: string;
    gender: Gender;
    type: UserType;
    recordDegree: RunningGroup;
  };
  participation: {
    totalCount: number;
    competitionCount: number;
    trainingCount: number;
  };
  personalInfo: {
    birthDate: string | null;
    phoneNumber: string | null;
    snsId: string | null;
    id1365: string | null;
    accountId: string | null;
  };
  runningInfo: {
    type: UserType;
    recordDegree: RunningGroup;
    detailRecord: string | null;
    hopePrefs: string | null;
  };
};

export type UpdatePersonalInfoRequest = {
  birthDate: string;
  phoneNumber: string;
  snsId: string | null;
  id1365?: string | null;
};

export type UpdatePersonalInfoResponse = {
  birthDate: string;
  phoneNumber: string;
  snsId: string | null;
  id1365: string | null;
};

export type UpdateRunningInfoRequest = {
  recordDegree: RunningGroup;
  detailRecord: string | null;
  hopePrefs: string | null;
};

export type UpdateRunningInfoResponse = {
  type: UserType;
  recordDegree: RunningGroup;
  detailRecord: string | null;
  hopePrefs: string | null;
};

export type SetAccountRequest = {
  accountId: string;
  password: string;
};

export type SetAccountResponse = {
  accountId: string;
};

export type CheckAccountDuplicatedRequest = {
  accountId: string;
};

export type CheckAccountDuplicatedResponse = {
  isUnique: boolean;
};

export type UserWithdrawalDeleteRequest = {
  reasons: string[];
};

export type MyActivityEventRelationFilter = ValueOf<
  typeof MY_ACTIVITY_EVENT_RELATION_FILTERS
>;

export type MyActivityPartnerSort = ValueOf<typeof MY_ACTIVITY_PARTNER_SORTS>;

export type MyActivityEventsQuery = {
  type?: EventListTypeFilter;
  relation?: MyActivityEventRelationFilter;
  page?: number;
};

export type MyActivityEventsResponse = {
  items: Array<{
    id: number;
    name: string;
    type: 'TRAINING' | 'COMPETITION';
    date: string;
    dateText: string;
  }>;
  pagination: {
    page: number;
    size: 10;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
  };
};

export type MyActivityPartnersQuery = {
  sort?: MyActivityPartnerSort;
  page?: number;
};

export type MyActivityPartnersResponse = {
  items: Array<{
    partnerId: string;
    name: string;
    type: UserType;
    eventCount: number;
    events: Array<{
      id: number;
      name: string;
      date: string;
      dateText: string;
    }>;
  }>;
  pagination: {
    page: number;
    size: 5;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
  };
};
