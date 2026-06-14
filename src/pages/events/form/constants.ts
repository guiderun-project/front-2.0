import type { EventCategory, EventType } from '@/api/types';
import type { SelectOptions } from '@/components';

export const EVENT_CREATE_QUERY_VALUES = {
  TRAINING: 'training',
  COMPETITION: 'competition',
} as const;

export type EventCreateQueryValue =
  (typeof EVENT_CREATE_QUERY_VALUES)[keyof typeof EVENT_CREATE_QUERY_VALUES];

export const EVENT_FORM_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
} as const;

export type EventFormMode =
  (typeof EVENT_FORM_MODES)[keyof typeof EVENT_FORM_MODES];

export const TRAINING_OPERATION_OPTIONS = [
  { value: 'GENERAL', label: '기본 훈련' },
  {
    value: 'GROUP',
    label: '그룹별 훈련',
    description: '대회준비 그룹과 기초보강 그룹으로 나뉘어요',
  },
] as const satisfies SelectOptions<Extract<EventCategory, 'GENERAL' | 'GROUP'>>;

export type TrainingOperationType =
  (typeof TRAINING_OPERATION_OPTIONS)[number]['value'];

export const EVENT_FORM_TITLES = {
  TRAINING: '훈련 모임 정보를\n작성해주세요',
  COMPETITION: '대회 모임 정보를\n작성해주세요',
} as const satisfies Record<EventType, string>;

export const ADDITIONAL_TEXT_QUESTION_MAX_COUNT = 1;
export const ADDITIONAL_QUESTION_TITLE_MAX_LENGTH = 20;
export const ADDITIONAL_SELECT_OPTION_MIN_COUNT = 1;
export const ADDITIONAL_SELECT_OPTION_MAX_COUNT = 3;
export const EVENT_CONTENT_MAX_LENGTH = 1000;
export const RUNNING_DISTANCE_MAX_LENGTH = 5;
export const DEFAULT_EVENT_START_TIME = '08:00';
export const DEFAULT_EVENT_END_TIME = '10:00';
export const DEFAULT_EVENT_MIN_NUM_V = 1;
export const DEFAULT_EVENT_MIN_NUM_G = 1;
