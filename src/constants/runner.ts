import type { RunningGroup, UserType } from '@/api/types';

export const RUNNER_TYPE_LABELS: Record<UserType, string> = {
  VI: '시각장애러너',
  GUIDE: '가이드러너',
};

/** 러닝 그룹은 실제로 A~E만 사용한다 (P 그룹 미사용). */
export type RunnerRecordGroup = Exclude<RunningGroup, 'P'>;

export const TRAINING_RECORD_LABELS: Record<UserType, Record<RunnerRecordGroup, string>> = {
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
