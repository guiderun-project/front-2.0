/** 입력값에서 숫자 이외 문자를 제거한다. */
export const onlyDigits = (value: string): string =>
  value.replace(/[^0-9]/g, '');

/** 새 비밀번호 입력 안내 문구. 규칙 위반 시 errorText, 입력 유도 시 helperText로 공용 사용한다. */
export const NEW_PASSWORD_GUIDE =
  '영문, 특수문자를 포함해 8자 이상 32자 미만 입력해주세요';

/**
 * 한국 휴대전화 번호 형식인지 검사한다.
 * onlyDigits로 정제된 숫자 문자열을 입력으로 받는다. (01X + 7~8자리)
 */
export const isValidKoreanPhone = (digits: string): boolean =>
  /^01[0-9]\d{7,8}$/.test(digits);

/** 새 비밀번호 규칙: 영문·특수문자를 포함하고 8자 이상 32자 미만이어야 한다. */
export const isValidNewPassword = (value: string): boolean =>
  value.length >= 8 &&
  value.length < 32 &&
  /[a-zA-Z]/.test(value) &&
  /[^a-zA-Z0-9]/.test(value);

/** 남은 시간(초)을 mm:ss 형식 문자열로 변환한다. (예: 180 → '03:00') */
export const formatRemainingTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

/** ISO 날짜 문자열을 가입일 표기(YYYY.MM.DD)로 변환한다. */
export const formatJoinDate = (iso: string): string => {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};
