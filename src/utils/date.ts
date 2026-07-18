export const getTodayISODate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * ISO(YYYY-MM-DD) 생년월일이 실재하는 날짜이고 오늘 이전인지 검사한다.
 * date picker 는 값을 ISO 로 주므로 별도 변환 없이 이 함수로 검증한다.
 */
export const isValidBirthDateISO = (isoDate: string): boolean => {
  const match = ISO_DATE_PATTERN.exec(isoDate);

  if (!match) {
    return false;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isRealDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return isRealDate && isoDate <= getTodayISODate();
};

