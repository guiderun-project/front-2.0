export enum RunningGroup {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  P = 'P',
}

export enum RoleEnum {
  New = 'NEW',
  Reject = 'REJECT',
  Wait = 'WAIT',
  User = 'USER',
  Coach = 'COACH',
  Admin = 'ADMIN',
  Withdrawal = 'WITHDRAWAL',
}

export enum GenderEnum {
  M = 'MALE',
  W = 'FEMALE',
}

export enum DisabilityEnum {
  VI = 'VI',
  GUIDE = 'GUIDE',
}

export enum EventType {
  Training = 'TRAINING',
  Competition = 'COMPETITION',
  TOTAL = 'TOTAL',
}

/**
 * @enum RecruitStatus 모집 상태
 * @var Upcoming 모집 예정
 * @var Open 모집중
 * @var Close 모집 종료
 * @var All 전체 현황
 */

export enum RecruitStatus {
  Upcoming = 'RECRUIT_UPCOMING',
  Open = 'RECRUIT_OPEN',
  Close = 'RECRUIT_CLOSE',
  End = 'RECRUIT_END',
  All = 'RECRUIT_ALL',
}

/**
 * @enum EventStatus 이벤트 상태
 * @var Upcoming 이벤트 시작 전
 * @var Open 이벤트 진행중
 * @var End 이벤트 종료
 * @var Reject 거절된 이벤트
 */

export enum EventStatus {
  Upcoming = 'EVENT_UPCOMING',
  Open = 'EVENT_OPEN',
  End = 'EVENT_END',
  Reject = 'EVENT_REJECT',
}
