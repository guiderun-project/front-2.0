/**
 * @enum EventSort 이벤트 정렬 기준
 * @var Open 모집 중
 * @var Total 전체 이벤트
 * @var Upcoming 진행 예정 이벤트
 * @var End 종료된 이벤트
 */

export enum EventSort {
  Open = 'OPEN',
  Total = 'TOTAL',
  Upcoming = 'UPCOMING',
  End = 'END',
}

/**
 * @enum 전체 이벤트용 이벤트 종류
 * @var Upcoming 예정 이벤트
 * @var End 지난 이벤트
 * @var My 내 이벤트
 */

export enum EventKind {
  Upcoming = 'UPCOMING',
  End = 'END',
  My = 'MY',
}

/**
 * @enum PartnerSort 함께 뛴 파트너 정렬 기준
 * @var Recent 최신 순
 * @var Count 횟수 순
 * @var Name 이름 순
 * @var Record 기록 순
 */

export enum PartnerSort {
  Recent = 'RECENT',
  Count = 'COUNT',
  Name = 'NAME',
  Record = 'RECORD',
}
