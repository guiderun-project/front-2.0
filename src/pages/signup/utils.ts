import type { TimeValue } from '@/components';
import type { SignupCommonInfo, SignupPostRequest } from '@/api/types';
import { RUNNER_TYPE, hasRunningRecord } from '@/constants';

import type { SignupFormValues } from '@/pages/signup/types';

// 기록 입력을 API 전송용 "HH:MM:SS" 문자열로 만든다. 기록이 없으면 null.
const formatDetailRecord = (record: TimeValue): string | null => {
  if (!hasRunningRecord(record)) {
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

  // 러닝 그룹은 사용자가 고른 값을 그대로 보낸다. (10KM 기록 기반 자동 기본값 + 수정 가능)
  const runningGroup = values.recordDegree;
  // 10KM 기록은 항상 필수 입력이므로 경험 유무와 무관하게 전송한다. (0 입력 시 "00:00:00")
  const detailRecord = formatDetailRecord(values.record);

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
