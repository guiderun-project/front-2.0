import type { RunningGroup } from '@/api/types';

export const EVENT_DETAIL_TABS = [
  { id: 'detail', label: '상세 내용' },
  { id: 'applicants', label: '신청자 명단' },
  { id: 'matching', label: '매칭현황' },
] as const;

export type EventVisibleRunningGroup = Extract<
  RunningGroup,
  'A' | 'B' | 'C' | 'D' | 'E'
>;
export type GroupTrainingRunningGroup = Extract<
  EventVisibleRunningGroup,
  'A' | 'B'
>;

export const EVENT_VISIBLE_RUNNING_GROUPS = [
  'A',
  'B',
  'C',
  'D',
  'E',
] as const satisfies readonly EventVisibleRunningGroup[];

export const COMPETITION_COURSE_LABELS: Record<EventVisibleRunningGroup, string> = {
  A: '풀코스',
  B: '30km 코스',
  C: '하프 코스',
  D: '10km 코스',
  E: '5km 코스',
};

export const GROUP_TRAINING_LABELS: Record<GroupTrainingRunningGroup, string> = {
  A: '마일리지 그룹',
  B: '기초 보강 그룹',
};

export const COMPETITION_COURSE_OPTIONS = EVENT_VISIBLE_RUNNING_GROUPS.map(
  (value) => ({
    value,
    label: COMPETITION_COURSE_LABELS[value],
  }),
);
