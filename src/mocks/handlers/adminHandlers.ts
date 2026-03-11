import { http, HttpHandler, HttpResponse } from 'msw';

import { NoneType } from '../handlers';

import { baseURL } from '@/api/core/client';
import {
  AdminApplyListCountGetResponse,
  AdminApplyListGetResponse,
  AdminApproveUserPostResponse,
  AdminCurrentEventGetResponse,
  AdminEventHistoryCountGetResponse,
  AdminEventHistoryGetResponse,
  AdminEventListCountGetResponse,
  AdminEventListGetResponse,
  AdminEventResultGetResponse,
  AdminEventTotalCountGetResponse,
  AdminEventTypeCountGetResponse,
  AdminGuideApplyGetRequest,
  AdminGuideApplyGetResponse,
  AdminNewUserGetResponse,
  AdminPartnerHistoryCountGetResponse,
  AdminPartnerHistoryGetResponse,
  AdminPartnerTypeCountGetResponse,
  AdminSearchEventCountGetResponse,
  AdminSearchEventGetResponse,
  AdminSearchEventHistoryCountGetResponse,
  AdminSearchEventHistoryGetResponse,
  AdminSearchPartnerHistoryCountGetResponse,
  AdminSearchPartnerHistoryGetResponse,
  AdminSearchWithdrawalListCountGetResponse,
  AdminSearchWithdrawalListGetResponse,
  AdminUserListCountGetResponse,
  AdminUserListGetResponse,
  AdminUserSearchCountGetResponse,
  AdminUserSearchGetResponse,
  AdminViApplyGetRequest,
  AdminViApplyGetResponse,
  AdminWithdrawalListCountGetResponse,
  AdminWithdrawalListGetResponse,
  EventHistoryItemType,
  EventListItemType,
  UserListItemType,
} from '@/api/contracts/admin';
import {
  DisabilityEnum,
  EventStatus,
  EventType,
  GenderEnum,
  RecruitStatus,
  RoleEnum,
  RunningGroup,
} from '@/api/contracts/common/group';

//
//
//

const USER_LIST_DATA: UserListItemType[] = [
  {
    userId: '1',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '2',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '3',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '4',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '5',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '6',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '7',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '8',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '9',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
  {
    userId: '10',
    age: 20,
    competitionCnt: 5,
    trainingCnt: 5,
    gender: GenderEnum.M,
    name: '홍길동',
    phoneNumber: '01234567890',
    role: RoleEnum.User,
    snsId: 'pride_sd',
    team: RunningGroup.B,
    type: DisabilityEnum.GUIDE,
    update_date: '00-00-00',
    update_time: '00.00.00',
    img: '',
  },
];

const EVENT_LIST_DATA: EventListItemType[] = [
  {
    approval: true,
    eventId: 123,
    minApply: 34,
    minNumG: 344,
    minNumV: 34,
    name: '테스트 이벤트',
    organizer: '홍길동',
    pace: RunningGroup.C,
    recuitStatus: RecruitStatus.Open,
    smallDate: '[1/2]',
    startTime: '00:00',
    update_date: '00-00',
    update_time: '00-00',
  },
  {
    approval: false,
    eventId: 123,
    minApply: 34,
    minNumG: 344,
    minNumV: 34,
    name: '테스트 이벤트',
    organizer: '홍길동',
    pace: RunningGroup.C,
    recuitStatus: RecruitStatus.Open,
    smallDate: '[1/2]',
    startTime: '00:00',
    update_date: '00-00',
    update_time: '00-00',
  },
];

const EVENT_HISTORY_DATA: EventHistoryItemType[] = [
  {
    endDate: '00-00-00',
    eventId: 1,
    eventType: EventType.Competition,
    name: '테스트이벤트',
    recruitStatus: RecruitStatus.Open,
  },
  {
    endDate: '00-00-00',
    eventId: 1,
    eventType: EventType.Competition,
    name: '테스트이벤트',
    recruitStatus: RecruitStatus.Open,
  },
  {
    endDate: '00-00-00',
    eventId: 1,
    eventType: EventType.Competition,
    name: '테스트이벤트',
    recruitStatus: RecruitStatus.Open,
  },
  {
    endDate: '00-00-00',
    eventId: 1,
    eventType: EventType.Competition,
    name: '테스트이벤트',
    recruitStatus: RecruitStatus.Open,
  },
  {
    endDate: '00-00-00',
    eventId: 1,
    eventType: EventType.Competition,
    name: '테스트이벤트',
    recruitStatus: RecruitStatus.Open,
  },
];

const VI_APPLY_DATA: AdminViApplyGetResponse = {
  age: 20,
  detailRecord: '22분',
  guideName: '홍길동',
  hopePrefs: '화이팅',
  howToKnow: ['vi.1'],
  isRunningExp: true,
  motive: 'ㅎㅎ',
  phoneNumber: '01234567890',
  portraitRights: true,
  privacy: true,
  recordDegree: RunningGroup.A,
  runningPlace: '서울',
  snsId: 'prind',
};

const GUIDE_APPLY_DATA: AdminGuideApplyGetResponse = {
  age: 20,
  detailRecord: '33분',
  guidingPace: RunningGroup.A,
  hopePrefs: 'ㅇㅇ',
  howToKnow: ['guide.2'],
  isGuideExp: true,
  motive: 'ddd',
  phoneNumber: '01234567890',
  portraitRights: true,
  privacy: true,
  recordDegree: RunningGroup.D,
  snsId: 'dd',
  viCount: '2',
};

const WITHDRAWAL_LIST = [
  {
    gender: GenderEnum.M,
    name: '홍길동',
    reason: ['다양한 활동이 있는 곳으로'],
    role: RoleEnum.User,
    team: RunningGroup.A,
    type: DisabilityEnum.GUIDE,
    update_date: '0000-00-00',
    update_time: '00:00',
    userId: '123',
  },
  {
    gender: GenderEnum.M,
    name: '홍길동',
    reason: ['다양한 활동이 있는 곳으로'],
    role: RoleEnum.User,
    team: RunningGroup.A,
    type: DisabilityEnum.GUIDE,
    update_date: '0000-00-00',
    update_time: '00:00',
    userId: '1234',
  },
  {
    gender: GenderEnum.M,
    name: '홍길동',
    reason: ['다양한 활동이 있는 곳으로'],
    role: RoleEnum.User,
    team: RunningGroup.A,
    type: DisabilityEnum.GUIDE,
    update_date: '0000-00-00',
    update_time: '00:00',
    userId: '1235',
  },
  {
    gender: GenderEnum.M,
    name: '홍길동',
    reason: ['다양한 활동이 있는 곳으로'],
    role: RoleEnum.User,
    team: RunningGroup.A,
    type: DisabilityEnum.GUIDE,
    update_date: '0000-00-00',
    update_time: '00:00',
    userId: '1236',
  },
  {
    gender: GenderEnum.M,
    name: '홍길동',
    reason: ['다양한 활동이 있는 곳으로'],
    role: RoleEnum.User,
    team: RunningGroup.A,
    type: DisabilityEnum.GUIDE,
    update_date: '0000-00-00',
    update_time: '00:00',
    userId: '1237',
  },
];

//
//
//

export const adminHandlers: HttpHandler[] = [
  // adminPartnerTypeCountGet
  http.get<{ userId: string }, NoneType, AdminPartnerTypeCountGetResponse>(
    baseURL + '/admin/partner-type/count/:userId',
    () => {
      return HttpResponse.json({ contestCnt: 10, trainingCnt: 10 });
    },
  ),

  // adminPartnerHistoryCountGet
  http.get<{ userId: string }, NoneType, AdminPartnerHistoryCountGetResponse>(
    baseURL + '/admin/partner-list/count/:userId',
    () => {
      return HttpResponse.json({ count: 43 });
    },
  ),

  // adminPartnerHistoryGet
  http.get<{ userId: string }, NoneType, AdminPartnerHistoryGetResponse>(
    baseURL + '/admin/partner-list/:userId',
    () => {
      return HttpResponse.json({
        items: [
          {
            img: '',
            like: 23,
            name: '홍길동',
            recordDegree: RunningGroup.A,
            role: RoleEnum.User,
            type: DisabilityEnum.GUIDE,
            userId: '1',
          },
          {
            img: '',
            like: 23,
            name: '홍길동',
            recordDegree: RunningGroup.A,
            role: RoleEnum.User,
            type: DisabilityEnum.GUIDE,
            userId: '2',
          },
          {
            img: '',
            like: 23,
            name: '홍길동',
            recordDegree: RunningGroup.A,
            role: RoleEnum.User,
            type: DisabilityEnum.GUIDE,
            userId: '3',
          },
          {
            img: '',
            like: 23,
            name: '홍길동',
            recordDegree: RunningGroup.A,
            role: RoleEnum.User,
            type: DisabilityEnum.GUIDE,
            userId: '4',
          },
          {
            img: '',
            like: 23,
            name: '홍길동',
            recordDegree: RunningGroup.A,
            role: RoleEnum.User,
            type: DisabilityEnum.GUIDE,
            userId: '5',
          },
          {
            img: '',
            like: 23,
            name: '홍길동',
            recordDegree: RunningGroup.A,
            role: RoleEnum.User,
            type: DisabilityEnum.GUIDE,
            userId: '6',
          },
        ],
      });
    },
  ),

  //adminNewUserGet
  http.get<NoneType, NoneType, AdminNewUserGetResponse>(
    baseURL + '/admin/new-user',
    () => {
      return HttpResponse.json({
        items: [
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자1',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '12sdfdsfs232',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자2',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '122sdfdsf32',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자3',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '1sdfsdf2232',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자4',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '122fdssdf32',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자5',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '12sdfsd232',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자6',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '122dfsdf32',
            recordDegree: RunningGroup.A,
          },
        ],
      });
    },
  ),
  //adminCurrentEventGet
  http.get<NoneType, NoneType, AdminCurrentEventGetResponse>(
    baseURL + '/admin/current-event',
    () => {
      return HttpResponse.json({
        items: [
          {
            eventId: 1,
            eventType: EventType.Competition,
            name: '이벤트1',
            recruitStatus: RecruitStatus.Open,
            date: '2000-00-00',
          },
          {
            eventId: 2,
            eventType: EventType.Competition,
            name: '이벤트2',
            recruitStatus: RecruitStatus.Open,
            date: '2000-00-00',
          },
          {
            eventId: 3,
            eventType: EventType.Competition,
            name: '이벤트3',
            recruitStatus: RecruitStatus.Open,
            date: '2000-00-00',
          },
          {
            eventId: 4,
            eventType: EventType.Competition,
            name: '이벤트4',
            recruitStatus: RecruitStatus.Open,
            date: '2000-00-00',
          },
        ],
      });
    },
  ),

  //adminUserListGet
  http.get<NoneType, NoneType, AdminUserListGetResponse>(
    baseURL + '/admin/user-list',
    () => {
      return HttpResponse.json({
        limit: 5,
        start: 0,
        items: USER_LIST_DATA,
      });
    },
  ),

  //adminUserListCountGet
  http.get<NoneType, NoneType, AdminUserListCountGetResponse>(
    baseURL + '/admin/user-list/count',
    () => {
      return HttpResponse.json({ count: 30 });
    },
  ),

  //adminUserSearchGet
  http.get<NoneType, NoneType, AdminUserSearchGetResponse>(
    baseURL + '/admin/search/user',
    () => {
      return HttpResponse.json({ items: USER_LIST_DATA.slice(0, 5) });
    },
  ),

  //adminUserSearchCountGet
  http.get<NoneType, NoneType, AdminUserSearchCountGetResponse>(
    baseURL + '/admin/search/user/count',
    () => {
      return HttpResponse.json({ count: 20 });
    },
  ),

  // adminEventTypeCountGet
  http.get<{ userId: string }, NoneType, AdminEventTypeCountGetResponse>(
    baseURL + '/admin/event-type/count/:userId',
    () => {
      return HttpResponse.json({
        contestCnt: 10,
        totalCnt: 20,
        trainingCnt: 10,
      });
    },
  ),

  //adminViApplyGet
  http.get<AdminViApplyGetRequest, NoneType, AdminViApplyGetResponse>(
    baseURL + '/admin/apply/vi/:userId',
    () => {
      return HttpResponse.json(VI_APPLY_DATA);
    },
  ),

  //adminGuideApplyGet
  http.get<AdminGuideApplyGetRequest, NoneType, AdminGuideApplyGetResponse>(
    baseURL + '/admin/apply/guide/:userId',
    () => {
      return HttpResponse.json(GUIDE_APPLY_DATA);
    },
  ),

  //adminApproveUserPost
  http.post<
    { userId: string },
    { isApptove: boolean; recordDegree: RunningGroup },
    AdminApproveUserPostResponse
  >(baseURL + '/admin/approval-user/:userId', () => {
    return HttpResponse.json({ role: RoleEnum.User });
  }),

  //adminEventListGet
  http.get<NoneType, NoneType, AdminEventListGetResponse>(
    baseURL + '/admin/event-list',
    () => {
      return HttpResponse.json({ items: EVENT_LIST_DATA });
    },
  ),

  //adminEventListCountGet
  http.get<NoneType, NoneType, AdminEventListCountGetResponse>(
    baseURL + '/admin/event-list/count',
    () => {
      return HttpResponse.json({ count: 50 });
    },
  ),

  // adminSearchEventGet
  http.get<NoneType, NoneType, AdminSearchEventGetResponse>(
    baseURL + '/admin/search/event',
    () => {
      return HttpResponse.json({ items: EVENT_LIST_DATA });
    },
  ),

  // adminSearchEventCountGet
  http.get<NoneType, NoneType, AdminSearchEventCountGetResponse>(
    baseURL + '/admin/search/event/count',
    () => {
      return HttpResponse.json({ count: 27 });
    },
  ),

  //adminEventHistoryGet
  http.get<{ userId: string }, NoneType, AdminEventHistoryGetResponse>(
    baseURL + '/admin/event-list/:userId',
    () => {
      return HttpResponse.json({ items: EVENT_HISTORY_DATA });
    },
  ),

  //adminEventHistoryCountGet
  http.get<{ userId: string }, NoneType, AdminEventHistoryCountGetResponse>(
    baseURL + '/admin/event-list/count/:userId',
    () => {
      return HttpResponse.json({ count: 40 });
    },
  ),

  //adminEventTotalCountGet
  http.get<{ userId: string }, NoneType, AdminEventTotalCountGetResponse>(
    baseURL + '/admin/:userId/event-type/count',
    () => {
      return HttpResponse.json({ competition: 10, training: 10 });
    },
  ),

  //adminSearchPartnerHistoryCountGet
  http.get<
    { userId: string },
    NoneType,
    AdminSearchPartnerHistoryCountGetResponse
  >(baseURL + '/admin/search/partner-list/count/:userId', () => {
    return HttpResponse.json({
      count: 34,
    });
  }),

  //adminSearchPartnerHistoryGet
  http.get<{ userId: string }, NoneType, AdminSearchPartnerHistoryGetResponse>(
    baseURL + '/admin/search/partner-list/:userId',
    () => {
      return HttpResponse.json({
        items: [
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자1',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '12sdfdsfs232',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자2',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '122sdfdsf32',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자3',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '1sdfsdf2232',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자4',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '122fdssdf32',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자5',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '12sdfsd232',
            recordDegree: RunningGroup.A,
          },
          {
            contestCnt: 5,
            img: '',
            like: 21,
            name: '사용자6',
            role: RoleEnum.User,
            trainingCnt: 3,
            type: DisabilityEnum.GUIDE,
            userId: '122dfsdf32',
            recordDegree: RunningGroup.A,
          },
        ],
      });
    },
  ),

  //adminSearchEventHistoryCountGet
  http.get<
    { userId: string },
    NoneType,
    AdminSearchEventHistoryCountGetResponse
  >(baseURL + '/admin/search/event-list/count/:userId', () => {
    return HttpResponse.json({ count: 30 });
  }),

  //adminSearchEventHistoryGet
  http.get<{ userId: string }, NoneType, AdminSearchEventHistoryGetResponse>(
    baseURL + '/admin/search/event-list/:userId',
    () => {
      return HttpResponse.json({
        items: [
          {
            eventId: 1,
            eventType: EventType.Competition,
            name: '테스트트트트트트트트',
            recruitStatus: RecruitStatus.Close,
            startDate: '2000-00-00',
          },
          {
            eventId: 2,
            eventType: EventType.Competition,
            name: '테스트트트트트트트트',
            recruitStatus: RecruitStatus.Close,
            startDate: '2000-00-00',
          },
          {
            eventId: 3,
            eventType: EventType.Training,
            name: '테스트트트트트트트트',
            recruitStatus: RecruitStatus.Close,
            startDate: '2000-00-00',
          },
          {
            eventId: 4,
            eventType: EventType.Competition,
            name: '테스트트트트트트트트',
            recruitStatus: RecruitStatus.Close,
            startDate: '2000-00-00',
          },
          {
            eventId: 5,
            eventType: EventType.Competition,
            name: '테스트트트트트트트트',
            recruitStatus: RecruitStatus.Close,
            startDate: '2000-00-00',
          },
        ],
      });
    },
  ),

  // adminWithdrawalListCountGet
  http.get<NoneType, NoneType, AdminWithdrawalListCountGetResponse>(
    baseURL + '/admin/withdrawal-list/count',
    () => {
      return HttpResponse.json({ count: 76 });
    },
  ),

  // adminWithdrawlListGet
  http.get<NoneType, NoneType, AdminWithdrawalListGetResponse>(
    baseURL + '/admin/withdrawal-list',
    () => {
      return HttpResponse.json({
        items: WITHDRAWAL_LIST,
      });
    },
  ),

  // adminSearchWithdrawalListCountGet
  http.get<NoneType, NoneType, AdminSearchWithdrawalListCountGetResponse>(
    baseURL + '/admin/search/withdrawal-list/count',
    () => {
      return HttpResponse.json({ count: 23 });
    },
  ),

  // adminSearchWithdrawalListGet
  http.get<NoneType, NoneType, AdminSearchWithdrawalListGetResponse>(
    baseURL + '/admin/search/withdrawal-list',
    () => {
      return HttpResponse.json({ items: WITHDRAWAL_LIST });
    },
  ),

  // adminApprovalEventPostRequest
  http.post<{ eventId: string }, { approval: boolean }>(
    baseURL + '/admin/approval-event/:eventId',
    () => {
      return HttpResponse.json();
    },
  ),

  // adminEventResultGet
  http.get<{ eventId: string }, NoneType, AdminEventResultGetResponse>(
    baseURL + '/admin/event-result/:eventId',
    () => {
      return HttpResponse.json({
        absent: 10,
        approval: true,
        date: '00-00-00',
        guideAbsent: 5,
        guideCnt: 20,
        name: '테스트 이벤트',
        organizer: '홍길동',
        pace: RunningGroup.C,
        recuitStatus: RecruitStatus.End,
        status: EventStatus.End,
        total: 30,
        type: EventType.Competition,
        viAbsent: 5,
        viCnt: 40,
      });
    },
  ),
  // adminApplyListGet
  http.get<{ eventId: string }, NoneType, AdminApplyListGetResponse>(
    baseURL + '/admin/apply-list/:eventId',
    () => {
      return HttpResponse.json({
        items: [
          {
            apply_time: '0000-00-00',
            name: '홍길동',
            role: RoleEnum.User,
            team: RunningGroup.C,
            type: DisabilityEnum.GUIDE,
            userId: '12234323',
          },
          {
            apply_time: '0000-00-00',
            name: '홍길동',
            role: RoleEnum.User,
            team: RunningGroup.C,
            type: DisabilityEnum.GUIDE,
            userId: '122342343',
          },
          {
            apply_time: '0000-00-00',
            name: '홍길동',
            role: RoleEnum.User,
            team: RunningGroup.A,
            type: DisabilityEnum.VI,
            userId: '123423',
          },
          {
            apply_time: '0000-00-00',
            name: '홍길동',
            role: RoleEnum.User,
            team: RunningGroup.D,
            type: DisabilityEnum.VI,
            userId: '122343',
          },
          {
            apply_time: '0000-00-00',
            name: '홍길동',
            role: RoleEnum.User,
            team: RunningGroup.C,
            type: DisabilityEnum.GUIDE,
            userId: '124323',
          },
          {
            apply_time: '0000-00-00',
            name: '홍길동',
            role: RoleEnum.User,
            team: RunningGroup.C,
            type: DisabilityEnum.GUIDE,
            userId: '1233',
          },
        ],
      });
    },
  ),

  // adminApplyListCountGet
  http.get<{ eventId: string }, NoneType, AdminApplyListCountGetResponse>(
    baseURL + '/admin/apply-list/count/:eventId',
    () => {
      return HttpResponse.json({ count: 50 });
    },
  ),
];
