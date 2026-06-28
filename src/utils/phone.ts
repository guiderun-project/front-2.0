export const PHONE_NUMBER_MAX_LENGTH = 13; // "010-1234-5678"

const PHONE_DIGIT_LENGTH = 11;

/** 입력값에서 숫자만 추출해 "010-XXXX-XXXX"(11자리) 또는 "016-XXX-XXXX"(10자리) 형태로 만든다. */
export const formatPhoneInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, PHONE_DIGIT_LENGTH);

  if (digits.length <= 3) return digits;
  // 11자리: 3-4-4, 10자리: 3-3-4
  const midEnd = digits.length === PHONE_DIGIT_LENGTH ? 7 : 6;
  if (digits.length <= midEnd) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, midEnd)}-${digits.slice(midEnd)}`;
};
