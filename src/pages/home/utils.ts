import type { UpcomingEventsGetResponse } from '@/api/types';

export type UpcomingGuestEvent = Extract<
  UpcomingEventsGetResponse,
  { viewerType: 'GUEST' }
>['items'][number];

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const pad2 = (value: number) => String(value).padStart(2, '0');

export const formatGuestEventDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);

  if (!year || !month || !day) {
    return isoDate;
  }

  const weekday = WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];

  return `${year}. ${pad2(month)}. ${pad2(day)} ${weekday}`;
};

export const formatDday = (dDay: number): string =>
  dDay <= 0 ? 'D-DAY' : `D-${dDay}`;

export const formatDdayLabel = (dDay: number): string =>
  dDay <= 0 ? '오늘' : `${dDay}일 뒤`;
