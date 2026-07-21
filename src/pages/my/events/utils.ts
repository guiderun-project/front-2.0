import { formatDateSrLabel, formatTimeRangeSrLabel } from '@/utils';

// "2026.06.01 Mon 09:00-11:00" 형태의 dateText 꼬리에서 시간 구간만 뽑는다.
const TIME_RANGE_PATTERN = /(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/;

const formatKoreanTimeLabel = (hourValue: number, minuteValue: number): string => {
  const period = hourValue < 12 ? '오전' : '오후';
  const hour = hourValue % 12 === 0 ? 12 : hourValue % 12;

  return minuteValue === 0
    ? `${period} ${hour}시`
    : `${period} ${hour}시 ${minuteValue}분`;
};

/**
 * 이벤트 날짜/시간의 스크린리더 전용 라벨.
 *
 * 시각 텍스트("2026.06.01 Mon 09:00-11:00")의 영문 요일은 한국어
 * 스크린리더가 음차하거나 언어 전환으로 읽고, 하이픈 시간 구간은 범위로
 * 낭독되지 않는다. ISO 날짜(date)와 dateText의 시간 구간을
 * "2026년 6월 1일 월요일 오전 9시부터 오전 11시까지"로 풀어 읽는다.
 * 해석할 수 없는 형식이면 dateText 를 그대로 반환한다.
 */
export const formatEventDateTimeSrLabel = (
  date: string,
  dateText: string,
): string => {
  const dateLabel = formatDateSrLabel(date, { withWeekday: true });
  const timeMatch = TIME_RANGE_PATTERN.exec(dateText);

  if (dateLabel === date || !timeMatch) {
    return dateText;
  }

  const startLabel = formatKoreanTimeLabel(
    Number(timeMatch[1]),
    Number(timeMatch[2]),
  );
  const endLabel = formatKoreanTimeLabel(
    Number(timeMatch[3]),
    Number(timeMatch[4]),
  );

  return `${dateLabel} ${formatTimeRangeSrLabel(startLabel, endLabel)}`;
};
