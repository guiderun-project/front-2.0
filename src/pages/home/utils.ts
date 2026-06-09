import type { UpcomingEventsGetResponse } from '@/api/types';

export type UpcomingGuestEvent = Extract<
  UpcomingEventsGetResponse,
  { viewerType: 'GUEST' }
>['items'][number];

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const pad2 = (value: number) => String(value).padStart(2, '0');

/**
 * GUEST 응답의 ISO 날짜(YYYY-MM-DD)를 화면 표기(예: 2026. 04. 11 토)로 변환한다.
 * 시간대 영향을 피하기 위해 로컬 기준으로 요일을 계산한다.
 */
export const formatGuestEventDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);

  if (!year || !month || !day) {
    return isoDate;
  }

  const weekday = WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];

  return `${year}. ${pad2(month)}. ${pad2(day)} ${weekday}`;
};

/** D-day 뱃지 표기. 당일은 D-DAY, 그 외는 D-N. */
export const formatDday = (dDay: number): string =>
  dDay <= 0 ? 'D-DAY' : `D-${dDay}`;

/** 스크린리더용 D-day 문구. */
export const formatDdayLabel = (dDay: number): string =>
  dDay <= 0 ? '오늘' : `${dDay}일 뒤`;
