import type { EventCategory, EventType, UserType } from '@/api/types';
import type { SelectOptions } from '@/components';
import { RUNNER_TYPE_LABELS, TRAINING_RECORD_LABELS } from '@/constants';

import {
  COMPETITION_COURSE_OPTIONS,
  EVENT_VISIBLE_RUNNING_GROUPS,
  GROUP_TRAINING_LABELS,
  type EventVisibleRunningGroup,
} from '../constants';
import { getEventPrimaryGroupLabel } from '../utils/groupLabel';

export type EventApplyGroupValue = EventVisibleRunningGroup;

export const EVENT_APPLY_GROUP_VALUES = EVENT_VISIBLE_RUNNING_GROUPS;
export const EVENT_APPLY_DETAIL_MAX_LENGTH = 100;

export const GROUP_TRAINING_OPTIONS = [
  {
    value: 'A',
    label: GROUP_TRAINING_LABELS.A,
    description: '풀 마라톤 대비 마일리지 누적 중심',
  },
  {
    value: 'B',
    label: GROUP_TRAINING_LABELS.B,
    description: '기초, 보강 중심 훈련',
  },
] as const satisfies SelectOptions<EventApplyGroupValue>;

export { COMPETITION_COURSE_OPTIONS };

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  TRAINING: '훈련',
  COMPETITION: '대회',
};

export const createGeneralTrainingOptions = (
  userType: UserType,
): SelectOptions<EventApplyGroupValue> => {
  return EVENT_APPLY_GROUP_VALUES.map((value) => ({
    value,
    label: `${RUNNER_TYPE_LABELS[userType]} ${value} (${TRAINING_RECORD_LABELS[userType][value]})`,
  }));
};

export const getPrimarySelectLabel = (
  eventType: EventType,
  eventCategory: EventCategory,
): string => {
  return getEventPrimaryGroupLabel({ eventType, eventCategory });
};
