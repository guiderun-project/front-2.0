import type { TimeValue } from '@/components';
import type { SignupCommonInfo, SignupPostRequest } from '@/api/types';
import { RUNNER_TYPE, type RunnerRecordGroup } from '@/constants';

import type { RunnerType, SignupFormValues } from '@/pages/signup/types';

// TRAINING_RECORD_LABELS(10KM 기록 구간) 기준 그룹 상한(분, 이하 포함). 초과 시 D, 기록 없음은 E.
const RUNNING_GROUP_MAX_MINUTES: Record<
  RunnerType,
  ReadonlyArray<{ group: RunnerRecordGroup; maxMinutes: number }>
> = {
  [RUNNER_TYPE.VI]: [
    { group: 'A', maxMinutes: 50 },
    { group: 'B', maxMinutes: 56 },
    { group: 'C', maxMinutes: 65 },
  ],
  [RUNNER_TYPE.GUIDE]: [
    { group: 'A', maxMinutes: 45 },
    { group: 'B', maxMinutes: 52 },
    { group: 'C', maxMinutes: 59 },
  ],
};

// 입력값이 하나라도 있으면 기록이 있다고 본다.
export const hasRecordInput = (record: TimeValue): boolean =>
  record.hours !== '' || record.minutes !== '' || record.seconds !== '';

// 10KM 러닝기록(시:분:초)을 러닝 그룹(A~E)으로 환산한다. 기록이 없으면 E.
export const deriveRunningGroup = (
  record: TimeValue,
  runnerType: RunnerType,
): RunnerRecordGroup => {
  if (!hasRecordInput(record)) {
    return 'E';
  }

  const hours = Number(record.hours) || 0;
  const minutes = Number(record.minutes) || 0;
  const totalMinutes = hours * 60 + minutes;

  const found = RUNNING_GROUP_MAX_MINUTES[runnerType].find(
    ({ maxMinutes }) => totalMinutes <= maxMinutes,
  );

  return found?.group ?? 'D';
};

// 기록 입력을 API 전송용 "HH:MM:SS" 문자열로 만든다. 기록이 없으면 null.
const formatDetailRecord = (record: TimeValue): string | null => {
  if (!hasRecordInput(record)) {
    return null;
  }

  const pad = (value: string) =>
    (Number(value) || 0).toString().padStart(2, '0');

  return `${pad(record.hours)}:${pad(record.minutes)}:${pad(record.seconds)}`;
};

const emptyToNull = (value: string): string | null => {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
};

// 폼 값을 가입 요청 형태(VI/GUIDE union)로 변환한다. 검증을 통과한 값이 들어온다고 가정한다.
export const toSignupRequest = (
  values: SignupFormValues,
): SignupPostRequest => {
  const common: SignupCommonInfo = {
    name: values.name.trim(),
    gender: values.gender as NonNullable<SignupFormValues['gender']>,
    birthDate: values.birthDate,
    phoneNumber: values.phoneNumber,
    snsId: emptyToNull(values.snsId),
    privacy: true,
    portraitRights: true,
  };

  const hopePrefs = emptyToNull(values.hopePrefs);
  const hasExperience = values.hasExperience ?? false;

  // 러닝 경험이 없으면 기록 없이 E팀으로 배정한다. (경험 변경 후 잔여 기록이 새지 않도록 명시적으로 분기)
  const runningGroup = hasExperience
    ? deriveRunningGroup(values.record, values.disabilityType ?? RUNNER_TYPE.GUIDE)
    : 'E';
  const detailRecord = hasExperience ? formatDetailRecord(values.record) : null;

  if (values.disabilityType === RUNNER_TYPE.VI) {
    return {
      disabilityType: 'VI',
      common,
      vi: {
        hasRunningExperience: hasExperience,
        runningGroup,
        detailRecord,
        hopePrefs,
      },
    };
  }

  return {
    disabilityType: 'GUIDE',
    common,
    guide: {
      id1365: emptyToNull(values.id1365),
      hasGuideExperience: hasExperience,
      partneredViName: emptyToNull(values.partneredViName),
      runningGroup,
      detailRecord,
      hopePrefs,
    },
  };
};
