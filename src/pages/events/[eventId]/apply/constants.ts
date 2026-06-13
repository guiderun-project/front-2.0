import type { EventCategory, EventType, RunningGroup, UserType } from '@/api/types';
import type { SelectOptions } from '@/components';

export type EventApplyGroupValue = Extract<RunningGroup, 'A' | 'B' | 'C' | 'D' | 'E'>;

export const EVENT_APPLY_GROUP_VALUES = ['A', 'B', 'C', 'D', 'E'] as const;

const TRAINING_RECORD_LABELS: Record<UserType, Record<EventApplyGroupValue, string>> = {
  VI: {
    A: '~50분',
    B: '51~56분',
    C: '57~65분',
    D: '66분~',
    E: '기록 없음',
  },
  GUIDE: {
    A: '~45분',
    B: '46~52분',
    C: '53~59분',
    D: '60분~',
    E: '기록 없음',
  },
};

const RUNNER_TYPE_LABELS: Record<UserType, string> = {
  VI: '시각장애러너',
  GUIDE: '가이드러너',
};

export const GROUP_TRAINING_OPTIONS = [
  {
    value: 'A',
    label: '마일리지 그룹',
    description: '풀 마라톤 대비 마일리지 누적 중심',
  },
  {
    value: 'B',
    label: '기초보강 그룹',
    description: '기초, 보강 중심 훈련',
  },
] as const satisfies SelectOptions<EventApplyGroupValue>;

export const COMPETITION_COURSE_OPTIONS = [
  { value: 'A', label: '풀코스' },
  { value: 'B', label: '30km 코스' },
  { value: 'C', label: '하프 코스' },
  { value: 'D', label: '10km 코스' },
  { value: 'E', label: '5km 코스' },
] as const satisfies SelectOptions<EventApplyGroupValue>;

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
  if (eventType === 'COMPETITION') {
    return '참가 희망 코스';
  }

  return eventCategory === 'GROUP' ? '훈련 희망 그룹' : '훈련 희망 팀';
};
