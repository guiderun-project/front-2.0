import type { RunningGroup, UserType } from '@/api/types';
import {
  TRAINING_RECORD_LABELS,
  TRAINING_RECORD_SR_LABELS,
  type RunnerRecordGroup,
} from '@/constants';

/** 예: "A ~50분" */
export const getRunningGroupLabel = (group: RunningGroup, type: UserType): string =>
  `${group} ${TRAINING_RECORD_LABELS[type][group as RunnerRecordGroup]}`;

/**
 * 예: "A 50분 이하" — 물결표(~) 구간 표기는 스크린리더 기본 설정에서 생략되어
 * 이하/이상 의미가 사라지므로, 낭독 전용으로 풀어 쓴 라벨을 제공한다.
 */
export const getRunningGroupSrLabel = (group: RunningGroup, type: UserType): string =>
  `${group} ${TRAINING_RECORD_SR_LABELS[type][group as RunnerRecordGroup]}`;

/** 값이 없을 때 정보 행에 표시할 기본 텍스트 */
export const EMPTY_INFO_TEXT = '없음';
