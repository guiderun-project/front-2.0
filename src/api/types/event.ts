import type {
  EventCategory,
  EventListTab,
  EventListTypeFilter,
  EventType,
  Pagination,
  RecruitStatus,
  RecruitStatusFilter,
  UserType,
} from './common';

export type EventsSummaryGetResponse = {
  publicSummary: {
    year: number;
    totalEventCount: number;
    totalRunningDistanceKm: number;
  };
  mySummary: {
    totalParticipationCount: number;
    totalRunningDistanceKm: number;
  } | null;
};

export type UpcomingEventsGetResponse =
  | {
      viewerType: 'GUEST';
      items: Array<{
        id: number;
        name: string;
        dDay: number;
        date: string;
      }>;
    }
  | {
      viewerType: 'MEMBER';
      items: Array<{
        id: number;
        name: string;
        dDay: number;
        place: string;
        scheduleText: string;
        myPartner: Array<{
          type: UserType;
          name: string;
        }> | null;
      }>;
    };

export type EventListGetRequest = {
  tab: EventListTab;
  type: EventListTypeFilter;
  recruitStatus?: RecruitStatusFilter;
  page: number;
};

export type EventListGetResponse = {
  items: Array<{
    id: number;
    recruitStatus: Exclude<RecruitStatus, 'RECRUIT_END'>;
    name: string;
    type: EventType;
    dateText: string;
  }>;
  pagination: Pagination & { size: 10 };
};

export type EventSearchGetRequest = EventListGetRequest & {
  keyword: string;
};

export type EventSearchGetResponse = EventListGetResponse;

export type EventDetailPath = {
  eventId: number;
};

export type EventDetailResponse = {
  eventId: number;
  recruitStartDate: string;
  recruitEndDate: string;
  name: string;
  eventType: EventType;
  eventCategory: EventCategory;
  recruitStatus: RecruitStatus;
  isPrivate: boolean;
  organizer: {
    name: string;
    type: UserType;
  };
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
    dateText: string;
  };
  place: string;
  expectedRunningDistanceKm: number | null;
  content: string;
  additionalQuestions: AdditionalQuestionDetail[];
  viewer: {
    isApplied: boolean;
    isOrganizer: boolean;
  } | null;
};

export type EventCityName = 'SEOUL' | 'BUSAN' | string;

export type AdditionalQuestion =
  | { type: 'TEXT'; title: string }
  | { type: 'SELECT'; title: string; options: string[] };

export type AdditionalQuestionDetail =
  | {
      questionId: number;
      type: 'TEXT';
      question: string;
    }
  | {
      questionId: number;
      type: 'SELECT';
      question: string;
      options: Array<{ optionId: number; value: string }>;
    };

export type EventCreateRequest = {
  recruitStartDate: string;
  recruitEndDate: string;
  name: string;
  eventType: EventType;
  date: string;
  startTime: string;
  endTime: string;
  minNumV: number;
  minNumG: number;
  place: string;
  content: string;
  eventCategory: EventCategory;
  cityName?: EventCityName;
  isPrivate?: boolean;
  expectedRunningDistanceKm?: number;
  additionalQuestions?: AdditionalQuestion[];
};

export type EventCreateResponse = {
  eventId: number;
  isApprove: boolean;
};

export type EventUpdatePath = EventDetailPath;

export type EventUpdateRequest = Omit<
  EventCreateRequest,
  'isPrivate' | 'expectedRunningDistanceKm' | 'additionalQuestions'
> & {
  isPrivate: boolean;
  expectedRunningDistanceKm?: number | null;
};

export type EventUpdateResponse = EventCreateResponse;
export type EventDeletePath = EventDetailPath;
export type EventClosePath = EventDetailPath;

export type MissingRunningDistanceGetResponse = {
  items: Array<{
    eventId: number;
    name: string;
    dateText: string;
  }>;
};

export type EventRunningDistancePath = EventDetailPath;

export type EventRunningDistancePatchRequest = {
  expectedRunningDistanceKm: number;
};

export type EventRunningDistancePatchResponse = {
  eventId: number;
  expectedRunningDistanceKm: number;
};

export type EventRunningDistanceSkipPath = EventDetailPath;

export type EventRunningDistanceSkipResponse = {
  eventId: number;
  isSkipped: boolean;
};
