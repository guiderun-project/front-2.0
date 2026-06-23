import type { FieldPath } from 'react-hook-form';

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

// RHF 필드 이름을 한곳에서 관리한다. 각 step의 Controller name/watch/setValue 가 같은 값을 공유하도록 한다.
export const SIGNUP_FIELD = {
  DISABILITY_TYPE: 'disabilityType',
  GENDER: 'gender',
  NAME: 'name',
  BIRTH_DATE: 'birthDate',
  PHONE_NUMBER: 'phoneNumber',
  SNS_ID: 'snsId',
  ID_1365: 'id1365',
  HAS_EXPERIENCE: 'hasExperience',
  PARTNERED_VI_NAME: 'partneredViName',
  RECORD: 'record',
  HOPE_PREFS: 'hopePrefs',
  AGREEMENTS: 'agreements',
  AGREEMENTS_PRIVACY: 'agreements.privacy',
  AGREEMENTS_PORTRAIT_RIGHTS: 'agreements.portraitRights',
} as const satisfies Record<string, FieldPath<SignupFormValues>>;

// 각 화면에서 "다음"으로 넘어가기 전에 검증할 필드. 선택 입력(snsId/id1365/partneredViName/record)은 제외한다.
export const SIGNUP_STEP_FIELDS: Record<
  SignupStepId,
  FieldPath<SignupFormValues>[]
> = {
  runnerType: [SIGNUP_FIELD.DISABILITY_TYPE],
  gender: [SIGNUP_FIELD.GENDER],
  basicInfo: [
    SIGNUP_FIELD.NAME,
    SIGNUP_FIELD.BIRTH_DATE,
    SIGNUP_FIELD.PHONE_NUMBER,
  ],
  experience: [SIGNUP_FIELD.HAS_EXPERIENCE],
  record: [SIGNUP_FIELD.RECORD],
  terms: [SIGNUP_FIELD.AGREEMENTS_PRIVACY, SIGNUP_FIELD.AGREEMENTS_PORTRAIT_RIGHTS],
  complete: [],
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
