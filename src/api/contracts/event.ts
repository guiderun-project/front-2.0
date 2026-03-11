import { CommentType, Event } from '@/api/contracts/common/event';
import {
  DisabilityEnum,
  EventType,
  RecruitStatus,
  RunningGroup,
} from '@/api/contracts/common/group';
import { EventKind, EventSort } from '@/api/contracts/common/sort';
import { UserType } from '@/api/contracts/common/user';

export type EventPostRequest = {
  recruitStartDate: string;
  recruitEndDate: string;
  eventCategory: Event['eventCategory'];
  name: Event['name'];
  type: Event['type'];
  startTime: Event['startTime'];
  endTime: Event['endTime'];
  minNumV: Event['minNumV'];
  minNumG: Event['minNumG'];
  place: Event['place'];
  content: Event['details'];
};

export type EventPostResponse = Pick<Event, 'eventId' | 'isApprove'>;

export type EventPatchRequest = {
  eventId: Event['eventId'];
  EventPatchRequestBody: EventPostRequest;
};

export type EventPatchResponse = Pick<Event, 'eventId' | 'isApprove'>;

export type EventDeleteRequest = Pick<Event, 'eventId'>;

export type EventGetRequest = Pick<Event, 'eventId'>;

export type EventGetResponse = Pick<
  Event,
  | 'eventId'
  | 'type'
  | 'name'
  | 'recruitStatus'
  | 'recruitStartDate'
  | 'recruitEndDate'
  | 'organizerId'
  | 'organizer'
  | 'organizerType'
  | 'organizerPace'
  | 'date'
  | 'startTime'
  | 'endTime'
  | 'created_at'
  | 'updated_at'
  | 'place'
  | 'minNumV'
  | 'minNumG'
  | 'numG'
  | 'numV'
  | 'details'
  | 'checkOrganizer'
  | 'isApply'
  | 'partner'
  | 'status'
  | 'eventCategory'
>;

export type EventPopupGetRequest = Pick<Event, 'eventId'>;

export type EventPopupGetResponse = Pick<
  Event,
  | 'eventId'
  | 'type'
  | 'name'
  | 'organizer'
  | 'organizerType'
  | 'recruitStatus'
  | 'status'
  | 'date'
  | 'startTime'
  | 'endTime'
  | 'place'
  | 'partner'
  | 'isApply'
  | 'eventCategory'
> & {
  organizerRecord: Event['organizerPace'];
  recruitVi: number;
  recruitGuide: number;
  viCnt: number;
  guideCnt: number;
  content: Event['updated_at'];
  hasPartner: boolean;
  updatedAt: Event['updated_at'];
};

export type MyEventGetRequest = {
  sort: EventSort;
  year: number;
};

export type MyEventItemType = {
  eventId: Event['eventId'];
  eventType: Event['type'];
  name: Event['name'];
  recruitStatus: Event['recruitStatus'];
  dDay: number;
  endDate: string;
};

export type MyEventGetResponse = {
  items: MyEventItemType[];
};

export type UpcomingEventGetRequest = {
  sort: EventSort.Open | EventSort.Upcoming;
};

export type UpcomingEventItemType = {
  eventId: Event['eventId'];
  eventType: Event['type'];
  name: Event['name'];
  isApply: Event['isApply']; //신청 여부
  recuitStatus: Event['recruitStatus']; //이벤트 모집 상태
  date: string; // 모집 마감일 or 대회 시작일
};

export type UpcomingEventGetResponse = {
  items: UpcomingEventItemType[];
};

export type AllEventGetRequest = {
  limit: number;
  start: number;
  sort: EventKind;
  type: EventType;
  kind: RecruitStatus;
};

export type AllEventItemType = {
  eventId: Event['eventId'];
  eventType: Event['type'];
  name: Event['name'];
  startDate: string;
  recruitStatus: Event['recruitStatus'];
};

export type AllEventGetResponse = {
  items: AllEventItemType[];
};

export type AllEventCountGetRequest = {
  sort: EventKind;
  type: EventType;
  kind: RecruitStatus;
};

export type AllEventCountGetResponse = {
  count: number;
};

export type SearchEventCountGetRequest = {
  title: string;
};

export type SearchEventCountGetResponse = {
  count: number;
};

export type SearchEventGetRequest = {
  title: string;
  limit: number;
  start: number;
};

export type EventItemType = {
  eventId: Event['eventId'];
  eventType: Event['type'];
  name: Event['name'];
  endDate: string;
  recruitStatus: Event['recruitStatus'];
};

export type SearchEventGetResponse = {
  items: EventItemType[];
};

type UpcomingEventDdayType = {
  name: Event['name'];
  dDay: number;
};

export type UpcomingEventDdayGetResponse = {
  eventItems: UpcomingEventDdayType[];
};

export type EventCalendarGetRequest = {
  year: number;
  month: number;
};

type EventCalendarResultType = {
  day: number;
  competition: boolean;
  training: boolean;
};

export type EventCalendarGetResponse = {
  result: EventCalendarResultType[];
};

export type CalendarEventItemType = {
  eventId: Event['eventId'];
  eventType: Event['type'];
  name: Event['name'];
  startDate: Event['startTime'];
  recruitStatus: Event['recruitStatus'];
};

export type EventCalendarDetailGetRequest = {
  year: number;
  month: number;
  day: number;
};

export type EventCalendarDetailGetResponse = {
  items: CalendarEventItemType[];
};

export type EventTypeCountGetRequest = {
  userId: UserType['userId'];
};

export type EventTypeCountGetResponse = {
  totalCnt: number;
  trainingCnt: number; //훈련 참여 수
  contestCnt: number; //대회 참여 수
};

export type EventFormType = {
  recruitStartDate: Event['recruitStartDate']; //모집 시작일
  recruitEndDate: Event['recruitEndDate']; //모집 마감일
  name: Event['name']; ///이벤트 제목
  eventType: Event['type']; // 대회,훈련 구분
  date: Event['date']; //이벤트 시작일
  startTime: Event['startTime']; //시작 시간
  endTime: Event['endTime']; //끝나는 시간
  minNumV: Event['minNumV']; //시각장애 러너 모집 희망 인원
  minNumG: Event['minNumG']; //가이드 러너 모집 희망 인원
  place: Event['place']; //이벤트 장소
  content: Event['details']; //이벤트 상세 내용
  eventCategory: Event['eventCategory']; //이벤트 카테고리
  cityName?: Event['cityName'];
};

export type NewEventPostRequest = EventFormType;

export type NewEventPostResponse = Pick<Event, 'eventId' | 'isApprove'>;

export type EditEventPatchRequest = {
  eventId: Event['eventId'];
  EditEventPatchRequestBody: EventFormType;
};

export type EditEventPatchResponse = EventFormType;

export type CloseEventPatchRequest = Pick<Event, 'eventId'>;

export type EventLikeCountGetRequest = Pick<Event, 'eventId'>;

export type EventLikeCountGetResponse = {
  likes: number;
  isLiked: boolean;
};

export type EventLikePoseRequest = Pick<Event, 'eventId'>;

export type EventLikePostResponse = {
  likes: number;
};

export type EventCommentCountGetRequest = Pick<Event, 'eventId'>;

export type EventCommentCountGetResponse = {
  count: number;
};

export type EventCommentGetRequest = {
  eventId: Event['eventId'];
  start?: number;
  limit?: number;
};

export type EventCommentGetResponse = {
  comments: CommentType[];
};

export type EventCommentLikeCountGetRequest = Pick<CommentType, 'commentId'>;

export type EventCommentLikeCountGetResponse = {
  likes: CommentType['likes'];
  isLiked: boolean;
};

export type EventCommentLikePostRequest = Pick<CommentType, 'commentId'>;

export type EventCommentLikePostResponse = Pick<CommentType, 'likes'>;

export type EventCommentPostRequest = {
  eventId: Event['eventId'];
  EventCommentPostBody: Pick<CommentType, 'content'>;
};

export type EventCommentPostResponse = Pick<CommentType, 'commentId'>;

export type EventCommentDeleteRequest = {
  eventId: Event['eventId'];
  commentId: CommentType['commentId'];
};

export type EventCommentDeleteResponse = Pick<CommentType, 'commentId'>;

export type EventCommentPatchRequest = {
  eventId: Event['eventId'];
  commentId: CommentType['commentId'];
  EventCommentPatchBody: Pick<CommentType, 'content'>;
};

export type EventCommentPatchResponse = Pick<CommentType, 'commentId'>;

export type EventApplyType = {
  group: RunningGroup; //원하는 페이스 그룹
  partner: string; //원하는 파트너
  detail: string; //상세 설명
  // 훈련 프로그램에서 원하는 페이스 그룹(body에 포함되지 않음)
  paceGroup?: string;
  // 실제 body에 포함되지 않음
  birthDate?: string; //생년월일 (대회용)
  contact?: string; //연락처 (대회용)
  tshirtSize?: string; //티셔츠 사이즈 (대회용)
};

export type EventApplyPostRequest = {
  eventId: Event['eventId'];
  EventApplyPostRequestBody: EventApplyType;
};

export type EventApplyPostResponse = {
  requestId: number;
};

export type EventApplyDeleteRequest = {
  eventId: Event['eventId'];
};

export type EventApplyPatchRequest = {
  eventId: Event['eventId'];
  EventApplyPatchRequestBody: EventApplyType;
};

export type EventApplyPatchResponse = {
  requestId: number;
};

export type EventApplyGetRequest = {
  eventId: Event['eventId'];
  userId: UserType['userId'];
};

export type EventApplyGetResponse = {
  type: DisabilityEnum; //VI, GUIDE 둘 가능
  name: string;
  pace: RunningGroup; // 이름 옆에 등급
  group: RunningGroup;
  partner: string;
  detail: string;
  eventCategory: Event['eventCategory'];
};

export type EventApplyCountGetRequest = Pick<Event, 'eventId'>;

export type EventApplyCountGetResponse = {
  count: number; //총 신청자 수
  vi: number; //vi 신청자 수
  guide: number; //guide 신청자 수
};

export type EventApplyStatusGetRequest = Pick<Event, 'eventId'>;

export type ApplyUserType = Pick<
  UserType,
  'userId' | 'type' | 'name' | 'recordDegree'
> & {
  phone?: UserType['phoneNumber'];
  applyRecord: RunningGroup;
};

export type EventApplyStatusGetResponse = {
  attend: ApplyUserType[];
  notAttend: ApplyUserType[];
};

export type EventAttendPostRequest = {
  eventId: Event['eventId'];
  userId: UserType['userId'];
};

export type EventAttendStatusCountGetRequest = Pick<Event, 'eventId'>;

export type EventAttendStatusCountGetResponse = {
  attend: number;
  notAttend: number;
};

export type EventMatchingPostRequest = {
  eventId: Event['eventId'];
  viId: UserType['userId'];
  userId: UserType['userId'];
};

export type EventNotMatchingCountGetRequest = Pick<Event, 'eventId'>;

export type EventNotMatchingCountGetResponse = {
  vi: number;
  guide: number;
};

export type ApplyUserAttendType = ApplyUserType & { isAttended: boolean };

export type EventNotMatchingGetRequest = Pick<Event, 'eventId'>;

export type EventNotMatchingGetResponse = {
  notMatch: ApplyUserAttendType[];
};

export type EventMatchedViCountGetRequest = Pick<Event, 'eventId'>;

export type EventMatchedViCountGetResponse = {
  vi: number;
};

export type EventMatchedViGetRequest = Pick<Event, 'eventId'>;

export type EventMatchedViGetResponse = {
  vi: ApplyUserAttendType[];
};

export type EventMatchedGuideCountGetRequest = {
  eventId: Event['eventId'];
  viId: UserType['userId'];
};

export type EventMatchedGuideCountGetResponse = {
  guide: number;
};

export type EventMatchedGuideGetRequest = {
  eventId: Event['eventId'];
  viId: UserType['userId'];
};

export type EventMatchedGuideGetResponse = {
  guide: ApplyUserAttendType[];
};

export type EventApplyAllGetRequest = Pick<Event, 'eventId'>;

export type EventApplyAllGetResponse = {
  vi: ApplyUserType[];
  guide: ApplyUserType[];
};

export type EventMatchingDeleteRequest = {
  eventId: Event['eventId'];
  userId: UserType['userId'];
};
