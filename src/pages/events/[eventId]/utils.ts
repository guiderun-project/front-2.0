import type { Key } from 'react';

import type {
  EventType,
  RecruitStatus,
  UserInfoGetResponse,
} from '@/api/types';
import { APPROVED_ROLES } from '@/constants';

import { EVENT_DETAIL_TABS } from './constants';
import type { EventDetailTab } from './types';

export const isEventDetailTab = (key: Key): key is EventDetailTab => {
  return EVENT_DETAIL_TABS.some((tab) => tab.id === key);
};

export const isApprovedUser = (user: UserInfoGetResponse | null) => {
  return user ? APPROVED_ROLES.has(user.role) : false;
};

export const getEventTypeLabel = (eventType: EventType) => {
  return eventType === 'TRAINING' ? '훈련' : '대회';
};

export const getRecruitStatusLabel = (recruitStatus: RecruitStatus) => {
  const labels = {
    RECRUIT_UPCOMING: '모집예정',
    RECRUIT_OPEN: '모집중',
    RECRUIT_CLOSE: '모집완료',
    RECRUIT_END: '종료',
  } satisfies Record<RecruitStatus, string>;

  return labels[recruitStatus];
};

export const getRecruitStatusBadgeTone = (recruitStatus: RecruitStatus) => {
  const tones = {
    RECRUIT_UPCOMING: 'orange',
    RECRUIT_OPEN: 'cyan2',
    RECRUIT_CLOSE: 'gray',
    // TODO: 종료 상태 Badge 디자인 대응 필요.
    RECRUIT_END: 'gray',
  } satisfies Record<RecruitStatus, 'cyan2' | 'gray' | 'orange'>;

  return tones[recruitStatus];
};

export const formatKoreanDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return `${year}년 ${month}월 ${day}일`;
};

export const formatKoreanTime = (value: string) => {
  const [hourValue, minuteValue] = value.split(':').map(Number);

  if (!Number.isInteger(hourValue) || !Number.isInteger(minuteValue)) {
    return value;
  }

  const period = hourValue < 12 ? '오전' : '오후';
  const hour = hourValue % 12 === 0 ? 12 : hourValue % 12;

  if (minuteValue === 0) {
    return `${period} ${hour}시`;
  }

  return `${period} ${hour}시 ${minuteValue}분`;
};

export const formatTimeRange = (startTime: string, endTime: string) => {
  return `${formatKoreanTime(startTime)} ~ ${formatKoreanTime(endTime)}`;
};

export const formatRelativeTime = (value: string) => {
  const createdAt = new Date(value).getTime();

  if (Number.isNaN(createdAt)) {
    return '';
  }

  const diffSeconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000));
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return '방금 전';
  }

  if (diffHours < 1) {
    return `${diffMinutes}분 전`;
  }

  if (diffDays < 1) {
    return `${diffHours}시간 전`;
  }

  if (diffDays < 30) {
    return `${diffDays}일 전`;
  }

  return `${Math.floor(diffDays / 30)}개월 전`;
};
