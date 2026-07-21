/**
 * 스크린리더(VoiceOver/TalkBack) 전용 낭독 라벨 포맷터 모음.
 *
 * 화면에 보이는 표기("2026. 07. 21", "~50분", "01012345678")는 구두점이
 * 생략되거나 숫자가 끊김 없이 낭독되어 의미가 왜곡되기 쉽다.
 * 이 유틸은 시각 표기는 그대로 두고 aria-label, HiddenText 등
 * 스크린리더 전용 텍스트를 만들 때 사용한다.
 */

const WEEKDAY_SR_LABELS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
] as const;

// "2026-07-21", "2026. 07. 21", "1990.01.15", "2026년 7월 21일" 등에서
// 연/월/일 숫자만 뽑는다. 뒤에 붙는 요일 표기("… 21 화")는 무시된다.
const DATE_LABEL_PATTERN = /(\d{4})[-./년\s]+(\d{1,2})[-./월\s]+(\d{1,2})/;

type FormatDateSrLabelOptions = {
  /** true 면 "2026년 7월 21일 화요일"처럼 요일을 함께 읽는다. */
  withWeekday?: boolean;
};

/**
 * 날짜 문자열을 스크린리더가 자연스럽게 읽는 한국어 라벨로 바꾼다.
 * 실재하지 않는 날짜이거나 날짜로 해석할 수 없으면 입력값을 그대로 반환한다.
 *
 * @example
 * formatDateSrLabel('2026-07-21'); // '2026년 7월 21일'
 * formatDateSrLabel('2026. 07. 21'); // '2026년 7월 21일'
 * formatDateSrLabel('1990.01.15'); // '1990년 1월 15일'
 * formatDateSrLabel('2026-07-21', { withWeekday: true }); // '2026년 7월 21일 화요일'
 */
export const formatDateSrLabel = (
  value: string,
  options: FormatDateSrLabelOptions = {},
): string => {
  const match = DATE_LABEL_PATTERN.exec(value);

  if (!match) {
    return value;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isRealDate) {
    return value;
  }

  const baseLabel = `${year}년 ${month}월 ${day}일`;

  return options.withWeekday
    ? `${baseLabel} ${WEEKDAY_SR_LABELS[date.getDay()]}`
    : baseLabel;
};

// 회원가입/내 정보 수정과 동일한 "HH:MM:SS" 10KM 기록 형식.
const TIME_RECORD_PATTERN = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;

/**
 * "HH:MM:SS" 러닝 기록을 스크린리더용 한국어 라벨로 바꾼다.
 * 값이 0인 단위(시간·분·초)는 생략하고, 형식이 다르면 입력값을 그대로 반환한다.
 *
 * @example
 * formatTimeRecordSrLabel('01:23:45'); // '1시간 23분 45초'
 * formatTimeRecordSrLabel('00:52:30'); // '52분 30초'
 * formatTimeRecordSrLabel('00:45:00'); // '45분'
 */
export const formatTimeRecordSrLabel = (record: string): string => {
  const match = TIME_RECORD_PATTERN.exec(record);

  if (!match) {
    return record;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);

  const parts = [
    hours > 0 ? `${hours}시간` : null,
    minutes > 0 ? `${minutes}분` : null,
    seconds > 0 ? `${seconds}초` : null,
  ].filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join(' ') : '0초';
};

/**
 * 휴대전화 번호를 스크린리더가 그룹 단위(010 / 1234 / 5678)로 끊어 읽는
 * 라벨로 바꾼다. 하이픈이 섞여 있어도 숫자만 추출해 처리하고,
 * 휴대전화 자릿수(10~11자리)가 아니면 입력값을 그대로 반환한다.
 *
 * @example
 * formatPhoneSrLabel('01012345678'); // '010 1234 5678'
 * formatPhoneSrLabel('010-1234-5678'); // '010 1234 5678'
 */
export const formatPhoneSrLabel = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const match = /^(\d{3})(\d{3,4})(\d{4})$/.exec(digits);

  if (!match) {
    return value;
  }

  return `${match[1]} ${match[2]} ${match[3]}`;
};

/**
 * 시작/끝 라벨을 "부터/까지" 범위 문장으로 잇는다.
 * 시각 표기의 물결표(~)는 VoiceOver/TalkBack 기본 구두점 설정에서 생략되어
 * 범위 의미가 사라지므로, 스크린리더 전용 텍스트에는 이 함수를 사용한다.
 * 이미 포맷된 라벨(예: 이벤트 상세의 formatKoreanTime 결과)을 그대로 넣으면 된다.
 *
 * @example
 * formatTimeRangeSrLabel('오전 9시', '오후 12시'); // '오전 9시부터 오후 12시까지'
 * formatTimeRangeSrLabel('09:00', '12:00'); // '09:00부터 12:00까지'
 */
export const formatTimeRangeSrLabel = (
  startLabel: string,
  endLabel: string,
): string => `${startLabel}부터 ${endLabel}까지`;
