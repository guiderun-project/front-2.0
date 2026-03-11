import {
  DisabilityEnum,
  EventStatus,
  EventType,
  RecruitStatus,
  RunningGroup,
} from './group';
import { UserType } from './user';

export enum EventCategory {
  GENERAL = 'GENERAL',
  GROUP = 'GROUP',
  TEAM = 'TEAM',
}

export enum EventCityName {
  SEOUL = 'SEOUL',
  BUSAN = 'BUSAN',
}

export type MachingPartnerType = {
  partnerName: string; //파트너 이름
  partnerRecord: RunningGroup; //파트너 러닝등급
  partnerType: DisabilityEnum; //파트너 타입(가이드인지 vi인지)
};

export type Event = {
  eventId: number; //이벤트 아이디
  type: EventType; //대회인지 훈련인지
  name: string; //제목
  recruitStatus: RecruitStatus; //이벤트 모집 상태
  recruitStartDate: string; //모집 시작일
  recruitEndDate: string; //모집 마감일
  organizerId: string; //주최자 userId
  organizer: string; //주최자 이름
  organizerType: DisabilityEnum; //주최자가 vi인지 guide 인지
  organizerPace: RunningGroup; //주최자 러닝 등급
  date: string; //이벤트 시작일
  startTime: string; //"HH : MM"
  endTime: string; //"HH : MM"
  created_at: string; //생성일
  updated_at: string; //수정일
  place: string; //달리는 장소
  minNumV: number; //희망 vi 인원
  minNumG: number; //희망 guide 인원
  numV: number; //참여 vi 인원
  numG: number; //참여 guide 인원
  details: string; //상세사항

  checkOrganizer: boolean; // 이벤트 개설자인지 아닌
  isApply: boolean; //신청 여부
  partner: MachingPartnerType[];
  status: EventStatus;
  isApprove: boolean;

  //이벤트 유형
  eventCategory: EventCategory;
  cityName: EventCityName;
};

export type CommentType = {
  commentId: number;
  content: string;
  createdAt: string;
  likes: number;
  userId: UserType['userId'];
  name: UserType['name'];
  type: UserType['type'];
};
