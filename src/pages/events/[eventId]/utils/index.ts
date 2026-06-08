import type { Key } from 'react';

import type { UserInfoGetResponse } from '@/api/types';
import { APPROVED_ROLES } from '@/constants';

import { EVENT_DETAIL_TABS } from '../constants';
import type { EventDetailTab } from '../types';

export const isEventDetailTab = (key: Key): key is EventDetailTab => {
  return EVENT_DETAIL_TABS.some((tab) => tab.id === key);
};

export const isApprovedUser = (user: UserInfoGetResponse | null) => {
  return user ? APPROVED_ROLES.has(user.role) : false;
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

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the textarea fallback for browsers that block Clipboard API.
    }
  }

  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};
