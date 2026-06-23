import type { SignupFormValues, SignupStepId } from '@/pages/signup/types';

// 회원가입 화면 순서(서브스텝 포함). Stepper 3단계와 약관·완료 화면을 모두 포함한다.
export const SIGNUP_STEP_IDS = [
  'runnerType',
  'gender',
  'basicInfo',
  'experience',
  'record',
  'terms',
  'complete',
] as const;

// Stepper에 노출되는 3단계 라벨
export const SIGNUP_STEPPER_LABELS = ['참여유형', '기본정보', '러닝경험'] as const;

// 각 화면이 속한 Stepper 단계(1-based). 약관·완료 화면은 Stepper를 노출하지 않으므로 null.
export const SIGNUP_STEP_STAGE: Record<SignupStepId, number | null> = {
  runnerType: 1,
  gender: 2,
  basicInfo: 2,
  experience: 3,
  record: 3,
  terms: null,
  complete: null,
};

export const SIGNUP_FORM_DEFAULT_VALUES: SignupFormValues = {
  disabilityType: null,
  gender: null,
  name: '',
  birthDate: '',
  phoneNumber: '',
  snsId: '',
  id1365: '',
  hasExperience: null,
  partneredViName: '',
  record: { hours: '', minutes: '', seconds: '' },
  hopePrefs: '',
  agreements: {
    privacy: false,
    portraitRights: false,
  },
};
