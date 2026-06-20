import type { RunningGroup, UserType } from '@/api/types';
import { RUNNER_TYPE_LABELS, TRAINING_RECORD_LABELS, type RunnerRecordGroup } from '@/constants';

/** 예: "시각장애러너 A (~50분)" */
export const getRunningGroupLabel = (group: RunningGroup, type: UserType): string =>
  `${RUNNER_TYPE_LABELS[type]} ${group} (${TRAINING_RECORD_LABELS[type][group as RunnerRecordGroup]})`;

/** 값이 없을 때 정보 행에 표시할 기본 텍스트 */
export const EMPTY_INFO_TEXT = '없음';
