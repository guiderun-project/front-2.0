export const PHONE_DIGIT_LENGTH = 11;

/** 한국 휴대전화 번호 형식인지 검사한다. 숫자만 있는 문자열을 입력으로 받는다. (01X + 7~8자리) */
export const isValidKoreanPhone = (digits: string): boolean =>
  /^01[0-9]\d{7,8}$/.test(digits);

/** 입력값에서 숫자 이외 문자를 제거하고 최대 11자리로 제한한다. */
export const normalizePhoneDigits = (value: string): string =>
  value.replace(/\D/g, '').slice(0, PHONE_DIGIT_LENGTH);
