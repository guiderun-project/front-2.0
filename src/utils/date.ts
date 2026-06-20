export const getTodayISODate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/** "YYYY.MM.DD" 입력 문자열의 최대 길이 */
export const BIRTH_DATE_MAX_LENGTH = 10;

const BIRTH_DATE_DIGIT_LENGTH = 8;

/** 입력값에서 숫자만 추출해 "YYYY.MM.DD" 형태로 만든다. */
export const formatBirthDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, BIRTH_DATE_DIGIT_LENGTH);

  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)]
    .filter(Boolean)
    .join('.');
};

/** ISO(YYYY-MM-DD) 날짜를 입력 표시용 "YYYY.MM.DD" 로 변환한다. */
export const formatISODateToBirthDateInput = (isoDate: string): string =>
  formatBirthDateInput(isoDate.replace(/-/g, ''));

/** "YYYY.MM.DD" 입력값을 검증해 ISO(YYYY-MM-DD) 로 변환한다. 유효하지 않으면 null. */
export const toBirthDateISO = (formatted: string): string | null => {
  const match = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(formatted);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isRealDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);
  const isoDate = `${year}-${month}-${day}`;

  if (!isRealDate || isoDate > getTodayISODate()) {
    return null;
  }

  return isoDate;
};
