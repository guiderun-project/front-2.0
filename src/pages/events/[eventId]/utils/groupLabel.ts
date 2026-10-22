import type {
  EventCategory,
  EventType,
  MatchingRunningGroup,
} from '@/api/types';
import { EVENT_CATEGORIES, EVENT_TYPES } from '@/api/constants';

import {
  COMPETITION_COURSE_LABELS,
  EVENT_VISIBLE_RUNNING_GROUPS,
  GROUP_TRAINING_LABELS,
  type EventVisibleRunningGroup,
  type GroupTrainingRunningGroup,
} from '../constants';

export type EventGroupLabelContext = {
  eventType: EventType;
  eventCategory: EventCategory;
};

export const getEventGroupDisplayLabel = (
  context: EventGroupLabelContext,
  group: MatchingRunningGroup,
): string => {
  if (group === '') {
    return '희망 그룹 미입력';
  }

  if (!isEventVisibleRunningGroup(group)) {
    return `${group}그룹`;
  }

  if (context.eventType === EVENT_TYPES.COMPETITION) {
    return COMPETITION_COURSE_LABELS[group];
  }

  if (context.eventCategory === EVENT_CATEGORIES.GROUP) {
    const groupTrainingLabel = isGroupTrainingRunningGroup(group)
      ? GROUP_TRAINING_LABELS[group]
      : null;

    return groupTrainingLabel ?? `${group}그룹`;
  }

  return `${group}그룹`;
};

export const getEventPrimaryGroupLabel = ({
  eventCategory,
  eventType,
}: EventGroupLabelContext): string => {
  if (eventType === EVENT_TYPES.COMPETITION) {
    return '참가 희망 코스';
  }

  return eventCategory === EVENT_CATEGORIES.GROUP
    ? '훈련 희망 그룹'
    : '훈련 희망 팀';
};

const isEventVisibleRunningGroup = (
  group: Exclude<MatchingRunningGroup, ''>,
): group is EventVisibleRunningGroup => {
  return EVENT_VISIBLE_RUNNING_GROUPS.some((displayGroup) => displayGroup === group);
};

const isGroupTrainingRunningGroup = (
  group: EventVisibleRunningGroup,
): group is GroupTrainingRunningGroup => {
  return group === 'A' || group === 'B';
};
