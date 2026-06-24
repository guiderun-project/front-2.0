import type {
  EventListGetRequest,
  EventListGetResponse,
  EventSearchGetRequest,
  EventSearchGetResponse,
  UpcomingEventsGetResponse,
} from '@/api/types/event';

export const EVENT_LIST_REQUEST_MATCHES_BACKEND_CONTRACT = {
  tab: 'UPCOMING',
  type: 'TOTAL',
  recruitStatus: 'RECRUIT_ALL',
  page: 1,
} satisfies EventListGetRequest;

export const EVENT_SEARCH_REQUEST_MATCHES_BACKEND_CONTRACT = {
  keyword: '러닝',
  tab: 'UPCOMING',
  type: 'TOTAL',
  recruitStatus: 'RECRUIT_ALL',
  page: 1,
} satisfies EventSearchGetRequest;

export const EVENT_LIST_RESPONSE_MATCHES_BACKEND_CONTRACT = {
  items: [
    {
      id: 1,
      recruitStatus: 'RECRUIT_OPEN',
      name: '훈련 모임',
      type: 'TRAINING',
      dateText: '2026. 06. 24 수',
    },
  ],
  pagination: {
    page: 1,
    size: 10,
    totalCount: 1,
    totalPages: 1,
    hasNext: false,
  },
} satisfies EventListGetResponse;

export const EVENT_SEARCH_RESPONSE_MATCHES_BACKEND_CONTRACT = {
  items: [
    {
      id: 1,
      recruitStatus: 'RECRUIT_OPEN',
      name: '대회 모임',
      type: 'COMPETITION',
      dateText: '2026. 06. 24 수',
    },
  ],
  pagination: {
    page: 1,
    size: 10,
    totalCount: 1,
    totalPages: 1,
    hasNext: false,
  },
} satisfies EventSearchGetResponse;

export const UPCOMING_GUEST_EVENTS_RESPONSE_MATCHES_BACKEND_CONTRACT = {
  viewerType: 'GUEST',
  items: [
    {
      id: 1,
      name: '다가오는 모임',
      dDay: 3,
      date: '2026-06-24',
    },
  ],
} satisfies UpcomingEventsGetResponse;

export const UPCOMING_MEMBER_EVENTS_RESPONSE_MATCHES_BACKEND_CONTRACT = {
  viewerType: 'MEMBER',
  items: [
    {
      id: 1,
      name: '참여 예정 모임',
      dDay: 3,
      place: '여의나루역 2번 출구',
      scheduleText: '2026년 6월 24일 (수) 오전 10시 ~ 오후 12시',
      myPartner: [
        {
          type: 'GUIDE',
          name: '가이드',
        },
      ],
    },
  ],
} satisfies UpcomingEventsGetResponse;
