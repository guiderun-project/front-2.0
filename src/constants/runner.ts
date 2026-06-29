import type { RunningGroup, UserType } from '@/api/types';
import type { TimeValue } from '@/components';

export const RUNNER_TYPE = {
  VI: 'VI',
  GUIDE: 'GUIDE',
} as const satisfies Record<string, UserType>;

export const RUNNER_TYPE_LABELS: Record<UserType, string> = {
  VI: '시각장애러너',
  GUIDE: '가이드러너',
};

/** 러닝 그룹은 실제로 A~E만 사용한다 (P 그룹 미사용). */
export type RunnerRecordGroup = Exclude<RunningGroup, 'P'>;

export const TRAINING_RECORD_LABELS: Record<
  UserType,
  Record<RunnerRecordGroup, string>
> = {
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

// 시/분/초 중 하나라도 입력되어 있으면 10KM 기록이 있다고 본다.
export const hasRunningRecord = (record: TimeValue): boolean =>
  record.hours !== '' || record.minutes !== '' || record.seconds !== '';

// 시·분·초가 모두 2자리(=6글자)로 채워졌는지. 부분 입력은 잘못된 값이라 완성 시점에만 그룹을 환산한다.
export const isRunningRecordComplete = (record: TimeValue): boolean =>
  record.hours.length === 2 &&
  record.minutes.length === 2 &&
  record.seconds.length === 2;

// TRAINING_RECORD_LABELS(10KM 기록 구간) 기준 그룹 상한(분, 이하 포함). 초과 시 D, 기록 없음은 E.
const RUNNING_GROUP_MAX_MINUTES: Record<
  UserType,
  ReadonlyArray<{ group: RunnerRecordGroup; maxMinutes: number }>
> = {
  VI: [
    { group: 'A', maxMinutes: 50 },
    { group: 'B', maxMinutes: 56 },
    { group: 'C', maxMinutes: 65 },
  ],
  GUIDE: [
    { group: 'A', maxMinutes: 45 },
    { group: 'B', maxMinutes: 52 },
    { group: 'C', maxMinutes: 59 },
  ],
};

// 10KM 러닝기록(시:분:초)을 러닝 그룹(A~E)으로 환산한다. 기록이 없거나 0이면 E(기록 없음).
export const deriveRunningGroup = (
  record: TimeValue,
  type: UserType,
): RunnerRecordGroup => {
  const hours = Number(record.hours) || 0;
  const minutes = Number(record.minutes) || 0;
  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes <= 0) {
    return 'E';
  }

  const found = RUNNING_GROUP_MAX_MINUTES[type].find(
    ({ maxMinutes }) => totalMinutes <= maxMinutes,
  );

  return found?.group ?? 'D';
};
