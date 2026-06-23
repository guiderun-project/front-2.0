import type { TimeValue } from '@/components';
import type { RUNNER_TYPE } from '@/constants';

import type { SIGNUP_STEP_IDS } from '@/pages/signup/constants';

export type RunnerType = (typeof RUNNER_TYPE)[keyof typeof RUNNER_TYPE];
export type Gender = 'MALE' | 'FEMALE';

// 회원가입 화면 순서 식별자(서브스텝 포함)
export type SignupStepId = (typeof SIGNUP_STEP_IDS)[number];

// 회원가입 전 단계에서 수집하는 폼 값. API 요청 형태(SignupPostRequest)로의 변환은 제출 시점에 처리한다.
export type SignupFormValues = {
  disabilityType: RunnerType | null; // 참여유형
  gender: Gender | null;
  name: string;
  birthDate: string;
  phoneNumber: string;
  snsId: string;
  id1365: string; // GUIDE 전용
  hasExperience: boolean | null; // 러닝/가이드 경험 유무
  partneredViName: string; // GUIDE 전용
  record: TimeValue; // 10KM 러닝기록 (시:분:초)
  hopePrefs: string;
  agreements: {
    privacy: boolean;
    portraitRights: boolean;
  };
};
