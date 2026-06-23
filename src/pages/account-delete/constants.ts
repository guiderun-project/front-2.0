export const WITHDRAWAL_REASONS = [
  '러닝을 이제 그만하고 싶어서',
  '다른 좋은 서비스가 있어서',
  '지역을 이동하게 되어서',
] as const;

export const WITHDRAWAL_CUSTOM_REASON = '직접 입력';
export const WITHDRAWAL_CUSTOM_REASON_MAX_LENGTH = 300;

export const WITHDRAWAL_REASON_OPTIONS = [
  ...WITHDRAWAL_REASONS,
  WITHDRAWAL_CUSTOM_REASON,
];
