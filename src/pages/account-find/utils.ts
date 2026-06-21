/** 입력값에서 숫자 이외 문자를 제거한다. */
export const onlyDigits = (value: string): string =>
  value.replace(/[^0-9]/g, '');
