import { http, HttpHandler, HttpResponse } from 'msw';

import { NoneType } from '../handlers';

import { baseURL } from '@/api/core/client';
import {
  AllEventCountGetResponse,
  AllEventGetResponse,
  EditEventPatchResponse,
  EventApplyAllGetResponse,
  EventApplyCountGetResponse,
  EventApplyGetResponse,
  EventApplyPatchResponse,
  EventApplyStatusGetResponse,
  EventApplyType,
  EventAttendStatusCountGetResponse,
  EventCalendarDetailGetResponse,
  EventCalendarGetResponse,
  EventCommentCountGetResponse,
  EventCommentDeleteResponse,
  EventCommentGetResponse,
  EventCommentLikeCountGetResponse,
  EventCommentLikePostResponse,
  EventCommentPatchResponse,
  EventCommentPostResponse,
  EventFormType,
  EventGetResponse,
  EventLikeCountGetResponse,
  EventLikePostResponse,
  EventMatchedGuideCountGetResponse,
  EventMatchedGuideGetResponse,
  EventMatchedViCountGetResponse,
  EventMatchedViGetResponse,
  EventNotMatchingCountGetResponse,
  EventNotMatchingGetResponse,
  EventPopupGetResponse,
  EventTypeCountGetRequest,
  EventTypeCountGetResponse,
  MyEventGetResponse,
  NewEventPostRequest,
  NewEventPostResponse,
  SearchEventCountGetResponse,
  SearchEventGetResponse,
  UpcomingEventDdayGetResponse,
} from '@/api/contracts/event';
import { EventCategory } from '@/api/contracts/common/event';
import {
  DisabilityEnum,
  EventStatus,
  EventType,
  RecruitStatus,
  RunningGroup,
} from '@/api/contracts/common/group';
import { EventSort } from '@/api/contracts/common/sort';

//You can add HTTP handler by msw DOCS
//https://mswjs.io/docs/network-behavior/rest

export const eventHandlers: HttpHandler[] = [
  http.delete<{ eventId: string; userId: string }>(
    baseURL + '/event/:eventId/match/:userId',
    () => {
      return HttpResponse.json();
    },
  ),

  //eventPopupGet
  http.get<{ eventId: string }, NoneType, EventPopupGetResponse>(
    baseURL + '/event/pop/:eventId',
    ({ params }) => {
      return HttpResponse.json({
        eventCategory: EventCategory.GROUP,
        content:
          '프로그램 내용\nA조, B조\n1. 준비체조 및 훈련공지 (10분)\n2.워밍업 (10분)\n3. 코어운동 트레이닝 10가지 트레이닝\n4. 인터벌 트레이닝 100M+100M(2000M) 10set\n5.마무리 스트레칭 및 질의응답(15분)',
        date: '2020-01-01',
        startTime: '00:00',
        endTime: '00:00',
        eventId: Number(params.eventId),
        name: '테스트 훈련',
        place: '테스트 장소',
        recruitStatus: RecruitStatus.Open,
        type: EventType.Training,
        updatedAt: '2020-01-01',
        hasPartner: false,
        isApply: true,
        organizer: '홍길동',
        organizerRecord: RunningGroup.A,
        organizerType: DisabilityEnum.GUIDE,
        recruitGuide: 22,
        recruitVi: 22,
        guideCnt: 22,
        viCnt: 22,
        status: EventStatus.Open,
        partner: [
          {
            partnerName: '홍길동',
            partnerRecord: RunningGroup.A,
            partnerType: DisabilityEnum.GUIDE,
          },
          {
            partnerName: '홍길똥',
            partnerRecord: RunningGroup.B,
            partnerType: DisabilityEnum.GUIDE,
          },
          {
            partnerName: '홍낄똥',
            partnerRecord: RunningGroup.C,
            partnerType: DisabilityEnum.GUIDE,
          },
        ],
      });
    },
  ),

  // upcomingEventDdayGet
  http.get<NoneType, NoneType, UpcomingEventDdayGetResponse>(
    baseURL + '/event/dday',
    () => {
      return HttpResponse.json({
        eventItems: [
          { dDay: 12, name: 'JTBC 마라톤' },
          { dDay: 22, name: '옥스팜 트레일워커' },
        ],
      });
    },
  ),

  //myEventGet
  http.get<NoneType, NoneType, MyEventGetResponse>(
    baseURL + '/event/my',
    ({ request }) => {
      const url = new URL(request.url);

      const sort = url.searchParams.get('sort');
      const year = Number(url.searchParams.get('year'));

      switch (sort) {
        case EventSort.Upcoming:
          return HttpResponse.json({
            items: [
              {
                eventId: 1,
                endDate: `${year}-00-00`,
                dDay: 1,
                eventType: EventType.Competition,
                name: '테스트 이벤트 1',
                recruitStatus: RecruitStatus.Upcoming,
              },
              {
                eventId: 2,
                endDate: `${year}-00-00`,
                dDay: 2,
                eventType: EventType.Training,
                name: '테스트 이벤트 2',
                recruitStatus: RecruitStatus.Open,
              },
              {
                eventId: 3,
                endDate: `${year}-00-00`,
                dDay: 3,
                eventType: EventType.Competition,
                name: '테스트 이벤트 3',
                recruitStatus: RecruitStatus.Open,
              },
              {
                eventId: 4,
                endDate: `${year}-00-00`,
                dDay: 4,
                eventType: EventType.Competition,
                name: '테스트 이벤트 4',
                recruitStatus: RecruitStatus.Upcoming,
              },
              {
                eventId: 5,
                endDate: `${year}-00-00`,
                dDay: 123,
                eventType: EventType.Competition,
                name: '테스트 이벤트 5',
                recruitStatus: RecruitStatus.Upcoming,
              },
            ],
          });
        case EventSort.End:
          return HttpResponse.json({
            items: [
              {
                eventId: 1,
                endDate: `${year}-00-00`,
                dDay: 1,
                eventType: EventType.Competition,
                name: '테스트 이벤트 1',
                recruitStatus: RecruitStatus.Close,
              },
              {
                eventId: 2,
                endDate: `${year}-00-00`,
                dDay: 2,
                eventType: EventType.Training,
                name: '테스트 이벤트 2',
                recruitStatus: RecruitStatus.Close,
              },
              {
                eventId: 3,
                endDate: `${year}-00-00`,
                dDay: 3,
                eventType: EventType.Competition,
                name: '테스트 이벤트 3',
                recruitStatus: RecruitStatus.Close,
              },
              {
                eventId: 4,
                endDate: `${year}-00-00`,
                dDay: 4,
                eventType: EventType.Competition,
                name: '테스트 이벤트 4',
                recruitStatus: RecruitStatus.Close,
              },
              {
                eventId: 5,
                endDate: `${year}-00-00`,
                dDay: 123,
                eventType: EventType.Competition,
                name: '테스트 이벤트 5',
                recruitStatus: RecruitStatus.Close,
              },
            ],
          });
      }
    },
  ),

  //searchEventCountGet
  http.get<NoneType, NoneType, SearchEventCountGetResponse>(
    baseURL + '/event/search/count',
    () => {
      return HttpResponse.json({ count: 40 });
    },
  ),

  //searchEventGet
  http.get<NoneType, NoneType, SearchEventGetResponse>(
    baseURL + '/event/search',
    ({ request }) => {
      const url = new URL(request.url);

      const limit = Number(url.searchParams.get('limit'));

      return HttpResponse.json({
        items: new Array(limit)
          .fill({
            eventId: 1,
            name: '테스트 이벤트 1',
            endDate: '00-00-00',
            eventType: EventType.Competition,
            recruitStatus: RecruitStatus.Open,
          })
          .map((event, idx) => {
            return { ...event, eventId: idx, name: `테스트 이벤트 ${idx}` };
          }),
      });
    },
  ),

  //eventCalendatGet
  http.get<NoneType, NoneType, EventCalendarGetResponse>(
    baseURL + '/event/calendar',
    () => {
      return HttpResponse.json({
        result: [
          { day: 1, competition: false, training: true },
          { day: 4, competition: true, training: true },
          { day: 14, competition: true, training: true },
          { day: 22, competition: false, training: false },
          { day: 25, competition: true, training: false },
        ],
      });
    },
  ),

  //eventCalendarDetailGet
  http.get<NoneType, NoneType, EventCalendarDetailGetResponse>(
    baseURL + '/event/calendar/detail',
    ({ request }) => {
      const url = new URL(request.url);
      const day = Number(url.searchParams.get('day'));
      if (![1, 4, 14, 25].includes(day)) {
        return HttpResponse.json({ items: [] });
      }

      return HttpResponse.json({
        items: [
          {
            eventId: 1,
            name: '테스트 이벤트 1',
            startDate: '00-00-00',
            eventType: EventType.Competition,
            recruitStatus: RecruitStatus.Open,
          },
          {
            eventId: 2,
            name: '테스트 이벤트 2',
            startDate: '00-00-00',
            eventType: EventType.Training,
            recruitStatus: RecruitStatus.Upcoming,
          },
        ],
      });
    },
  ),

  http.get<NoneType, NoneType, AllEventCountGetResponse>(
    baseURL + '/event/all/count',
    () => {
      return HttpResponse.json({ count: 30 });
    },
  ),

  http.get<NoneType, NoneType, AllEventGetResponse>(
    baseURL + '/event/all',
    () => {
      return HttpResponse.json({
        items: [
          {
            eventId: 1,
            name: '테스트 이벤트 1',
            startDate: '00-00-00',
            eventType: EventType.Competition,
            recruitStatus: RecruitStatus.Open,
          },
          {
            eventId: 2,
            name: '테스트 이벤트 2',
            startDate: '00-00-00',
            eventType: EventType.Training,
            recruitStatus: RecruitStatus.Upcoming,
          },
          {
            eventId: 3,
            name: '테스트 이벤트 3',
            startDate: '00-00-00',
            eventType: EventType.Competition,
            recruitStatus: RecruitStatus.Open,
          },
          {
            eventId: 4,
            name: '테스트 이벤트 4',
            startDate: '00-00-00',
            eventType: EventType.Training,
            recruitStatus: RecruitStatus.Upcoming,
          },
          {
            eventId: 5,
            name: '테스트 이벤트 5',
            startDate: '00-00-00',
            eventType: EventType.Competition,
            recruitStatus: RecruitStatus.Open,
          },
          {
            eventId: 6,
            name: '테스트 이벤트 6',
            startDate: '00-00-00',
            eventType: EventType.Training,
            recruitStatus: RecruitStatus.Upcoming,
          },
        ],
      });
    },
  ),

  //eventTypeCountGet
  http.get<EventTypeCountGetRequest, NoneType, EventTypeCountGetResponse>(
    baseURL + '/user/event-type/count/:userId',
    () => {
      return HttpResponse.json({
        totalCnt: 15,
        contestCnt: 10,
        trainingCnt: 5,
      });
    },
  ),

  //newEventPost
  http.post<NoneType, NewEventPostRequest, NewEventPostResponse>(
    baseURL + '/event',
    () => {
      return HttpResponse.json({
        eventId: 123,
        isApprove: false,
      });
    },
  ),

  //closeEventPatch
  http.patch<{ eventId: string }>(baseURL + '/event/close/:eventId', () => {
    return HttpResponse.json();
  }),

  //editEventPatch
  http.patch<{ eventId: string }, EventFormType, EditEventPatchResponse>(
    baseURL + '/event/:eventId',
    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json(body);
    },
  ),

  //eventGet
  http.get<{ eventId: string }, NoneType, EventGetResponse>(
    baseURL + `/event/:eventId`,
    () => {
      return HttpResponse.json({
        eventCategory: EventCategory.GROUP,
        checkOrganizer: true,
        created_at: '2020-02-02',
        date: '2000-12-22',
        details:
          '프로그램 내용\nA조, B조\n1. 준비체조 및 훈련공지 (10분)\n2.워밍업 (10분)\n3. 코어운동 트레이닝 10가지 트레이닝\n4. 인터벌 트레이닝 100M+100M(2000M) 10set\n5.마무리 스트레칭 및 질의응답(15분)',
        startTime: '01:00',
        endTime: '10:00',
        eventId: 1,
        minNumG: 10,
        minNumV: 10,
        name: '테스트 이벤트',
        numG: 11,
        numV: 12,
        organizerType: DisabilityEnum.GUIDE,
        organizer: '홍길동',
        organizerId: '13',
        organizerPace: RunningGroup.A,
        partner: [
          {
            partnerName: '홍길동',
            partnerRecord: RunningGroup.A,
            partnerType: DisabilityEnum.GUIDE,
          },
          {
            partnerName: '홍길똥',
            partnerRecord: RunningGroup.B,
            partnerType: DisabilityEnum.GUIDE,
          },
          {
            partnerName: '홍낄똥',
            partnerRecord: RunningGroup.C,
            partnerType: DisabilityEnum.GUIDE,
          },
        ],
        place: '잠실 보조 경기장',
        recruitEndDate: '2024-06-12',
        recruitStartDate: '2024-06-12',
        recruitStatus: RecruitStatus.Open,
        status: EventStatus.Open,
        isApply: false,
        type: EventType.Competition,
        updated_at: '2020-02-02',
      });
    },
  ),

  //eventLikePost
  http.post<{ eventId: string }, NoneType, EventLikePostResponse>(
    baseURL + '/event/:eventId/likes',
    () => {
      return HttpResponse.json({ likes: 501 });
    },
  ),

  //eventLikeCountGet
  http.get<{ eventId: string }, NoneType, EventLikeCountGetResponse>(
    baseURL + '/event/:eventId/likes/count',
    () => {
      return HttpResponse.json({ likes: 500, isLiked: true });
    },
  ),

  //eventCommentCountGet
  http.get<{ eventId: string }, NoneType, EventCommentCountGetResponse>(
    baseURL + '/event/:eventId/comments/count',
    () => {
      return HttpResponse.json({
        count: 30,
      });
    },
  ),

  // eventCommentGet
  http.get<{ eventId: string }, NoneType, EventCommentGetResponse>(
    baseURL + '/event/:eventId/comments',
    () => {
      return HttpResponse.json({
        comments: [
          {
            commentId: 324,
            content: '너무 좋은1',
            createdAt: '2000-01-01',
            likes: 22,
            name: '홍길동',
            type: DisabilityEnum.GUIDE,
            userId: '123',
          },
          {
            commentId: 3324224,
            content:
              '너무 좋은2 기이이이이이이이이이이\n이이이이이이이이 이이이이이이이 이이이이이이이이이이이 이이이이f 이이이이이이이인 문장',
            createdAt: '2000-01-02',
            likes: 22,
            name: '사오정',
            type: DisabilityEnum.VI,
            userId: '1233',
          },
          {
            commentId: 332424234324,
            content:
              '너무 좋은2 기이이이이이이이이이이\n이이이이이이이이 이이이이이이이\n\n\n\n\n\n\n이이fdfdsfdsakl\n\n\n\n\n\n이이이이이이이이이 이이이이f 이이이이이이이인 문장',
            createdAt: '2000-01-02',
            likes: 22,
            name: '사오정',
            type: DisabilityEnum.VI,
            userId: '1233',
          },
          {
            commentId: 3223424,
            content: '너무3',
            createdAt: '2000-01-03',
            likes: 424,
            name: '손오공',
            type: DisabilityEnum.VI,
            userId: '123',
          },
          {
            commentId: 3472324,
            content:
              '너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4너무좋은4',
            createdAt: '2000-01-04',
            likes: 22,
            name: '저팔께',
            type: DisabilityEnum.GUIDE,
            userId: '123432',
          },
        ],
      });
    },
  ),

  // eventCommentLikeCountGet
  http.get<{ conmmentId: string }, NoneType, EventCommentLikeCountGetResponse>(
    baseURL + '/event/comment/:commentId/likes/count',
    () => {
      return HttpResponse.json({ isLiked: true, likes: 12 });
    },
  ),

  // eventCommentLikePost
  http.post<{ conmmentId: string }, NoneType, EventCommentLikePostResponse>(
    baseURL + '/event/comment/:commentId/likes',
    () => {
      return HttpResponse.json({ likes: 13 });
    },
  ),

  // eventCommentPost
  http.post<{ eventId: string }, { content: string }, EventCommentPostResponse>(
    baseURL + '/event/:eventId/comments',
    () => {
      return HttpResponse.json({ commentId: 13123 });
    },
  ),

  // eventApplyGet
  http.get<
    { eventId: string; userId: string },
    NoneType,
    EventApplyGetResponse
  >(baseURL + '/event/:eventId/form/:userId', () => {
    return HttpResponse.json({
      eventCategory: EventCategory.GROUP,
      detail: '심장 터지도록 뛰고 싶어요!',
      group: RunningGroup.A,
      name: '홍길동',
      pace: RunningGroup.B,
      partner: '고길동',
      type: DisabilityEnum.GUIDE,
    });
  }),

  // eventApplyPatch
  http.patch<{ eventId: string }, EventApplyType, EventApplyPatchResponse>(
    baseURL + '/event/:eventId/form',
    () => {
      return HttpResponse.json({ requestId: 12343456543234 });
    },
  ),

  // eventApplyPost
  http.post<{ eventId: string }, EventApplyType, EventApplyPatchResponse>(
    baseURL + '/event/:eventId/form',
    () => {
      return HttpResponse.json({ requestId: 12343456543234 });
    },
  ),

  //eventApplyDelete
  http.delete<{ eventId: string }>(baseURL + '/event/:eventId/form', () => {
    return HttpResponse.json();
  }),

  // eventCommentPatch
  http.patch<
    { eventId: string; commentId: string },
    { content: string },
    EventCommentPatchResponse
  >(baseURL + '/event/:eventId/:commentId', () => {
    return HttpResponse.json({ commentId: 23141 });
  }),

  // eventCommentDelete
  http.delete<
    { commentId: string; eventId: string },
    NoneType,
    EventCommentDeleteResponse
  >(baseURL + '/event/:eventId/:commentId', () => {
    return HttpResponse.json({ commentId: 34311 });
  }),

  //eventApplyAllGet
  http.get<{ eventId: string }, NoneType, EventApplyAllGetResponse>(
    baseURL + '/event/:eventId/forms/all',
    () => {
      return HttpResponse.json({
        guide: [
          {
            name: '가이드1',
            type: DisabilityEnum.GUIDE,
            userId: '13vbf42',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
            phone: '01012345678',
          },
          {
            name: '가이드2',
            type: DisabilityEnum.GUIDE,
            userId: '15ghtfv6',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드3',
            type: DisabilityEnum.GUIDE,
            userId: 'vbbxdv1',
            applyRecord: RunningGroup.B,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드4',
            type: DisabilityEnum.GUIDE,
            userId: 'jrgsgdfgdyr1',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드5',
            type: DisabilityEnum.GUIDE,
            userId: '1dfgdfgerervsd',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드6',
            type: DisabilityEnum.GUIDE,
            userId: '1663dfgdf4r',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드7',
            type: DisabilityEnum.GUIDE,
            userId: '1njsfdfgdfg',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드8',
            type: DisabilityEnum.GUIDE,
            userId: '16dfgdfwef',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드9',
            type: DisabilityEnum.GUIDE,
            userId: '1fbdfh5dfgdfg',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드10',
            type: DisabilityEnum.GUIDE,
            userId: '1gdfgrtadasda4',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
        ],
        vi: [
          {
            name: 'VI1',
            type: DisabilityEnum.VI,
            userId: '1312sdfs31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI2',
            type: DisabilityEnum.VI,
            userId: '1312fsdsfsd31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI3',
            type: DisabilityEnum.VI,
            userId: '131sf2bv31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI4',
            type: DisabilityEnum.VI,
            userId: '13sdfsdfssfs1231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI5',
            type: DisabilityEnum.VI,
            userId: '1sdf31ghgfcg231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI6',
            type: DisabilityEnum.VI,
            userId: '1312sdffvbhfs31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI7',
            type: DisabilityEnum.VI,
            userId: '131sfssdfs2fdcv31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
        ],
      });
    },
  ),

  // eventApplyCountGet
  http.get<{ eventId: string }, NoneType, EventApplyCountGetResponse>(
    baseURL + '/event/:eventId/forms/count',
    () => {
      return HttpResponse.json({ count: 300, guide: 15, vi: 15 });
    },
  ),

  // eventApplyStatusGet
  http.get<{ eventId: string }, NoneType, EventApplyStatusGetResponse>(
    baseURL + '/event/:eventId/forms',
    () => {
      return HttpResponse.json({
        attend: [
          {
            name: 'VI1',
            type: DisabilityEnum.VI,
            userId: '1312sdfs31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI2',
            type: DisabilityEnum.VI,
            userId: '1312fsdsfsd31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI3',
            type: DisabilityEnum.VI,
            userId: '131sf2bv31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI4',
            type: DisabilityEnum.VI,
            userId: '13sdfsdfssfs1231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI5',
            type: DisabilityEnum.VI,
            userId: '1sdf31ghgfcg231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI6',
            type: DisabilityEnum.VI,
            userId: '1312sdffvbhfs31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI7',
            type: DisabilityEnum.VI,
            userId: '131sfssdfs2fdcv31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드1',
            type: DisabilityEnum.GUIDE,
            userId: '13vbf42',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드2',
            type: DisabilityEnum.GUIDE,
            userId: '15ghtfv6',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드3',
            type: DisabilityEnum.GUIDE,
            userId: 'vbbxdv1',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드4',
            type: DisabilityEnum.GUIDE,
            userId: 'jrgsgdfgdyr1',
            applyRecord: RunningGroup.B,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드5',
            type: DisabilityEnum.GUIDE,
            userId: '1dfgdfgerervsd',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드6',
            type: DisabilityEnum.GUIDE,
            userId: '1663dfgdf4r',
            applyRecord: RunningGroup.B,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드7',
            type: DisabilityEnum.GUIDE,
            userId: '1njsfdfgdfg',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드8',
            type: DisabilityEnum.GUIDE,
            userId: '16dfgdfwef',
            applyRecord: RunningGroup.B,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드9',
            type: DisabilityEnum.GUIDE,
            userId: '1fbdfh5dfgdfg',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드10',
            type: DisabilityEnum.GUIDE,
            userId: '1gdfgrtadasda4',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
        ],
        notAttend: [
          {
            name: 'VI1',
            type: DisabilityEnum.VI,
            userId: '131231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI2',
            type: DisabilityEnum.VI,
            userId: '1312fsd31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI3',
            type: DisabilityEnum.VI,
            userId: '131sf231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI4',
            type: DisabilityEnum.VI,
            userId: '13sdfsdfs1231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI5',
            type: DisabilityEnum.VI,
            userId: '1sdf31231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI6',
            type: DisabilityEnum.VI,
            userId: '1312sdfs31',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI7',
            type: DisabilityEnum.VI,
            userId: '131sfssdfs231',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드1',
            type: DisabilityEnum.GUIDE,
            userId: '1342',
            recordDegree: RunningGroup.A,
            applyRecord: RunningGroup.A,
          },
          {
            name: '가이드2',
            type: DisabilityEnum.GUIDE,
            userId: '156',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드3',
            type: DisabilityEnum.GUIDE,
            userId: 'vdv1',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드4',
            type: DisabilityEnum.GUIDE,
            userId: 'jrgsyr1',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드5',
            type: DisabilityEnum.GUIDE,
            userId: '1erervsd',

            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드6',
            type: DisabilityEnum.GUIDE,
            userId: '16634r',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드7',
            type: DisabilityEnum.GUIDE,
            userId: '1njsfg',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드8',
            type: DisabilityEnum.GUIDE,
            userId: '16wef',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드9',
            type: DisabilityEnum.GUIDE,
            userId: '1fbdfh5',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드10',
            type: DisabilityEnum.GUIDE,
            userId: '1gdfgrt4',
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
        ],
      });
    },
  ),

  // eventAttendPost
  http.post<{ eventId: string; userId: string }>(
    baseURL + '/event/:eventId/attend/:userId',
    () => {
      return HttpResponse.json();
    },
  ),

  // eventAttendStatusCountGet
  http.get<{ eventId: string }, NoneType, EventAttendStatusCountGetResponse>(
    baseURL + '/event/:eventId/attend/count',
    () => {
      return HttpResponse.json({ attend: 10, notAttend: 10 });
    },
  ),

  // eventMatchingPost
  http.post<{ eventId: string; userId: string; viId: string }>(
    baseURL + '/event/:eventId/match/:viId/:userId',
    () => {
      return HttpResponse.json();
    },
  ),

  // eventMatchingDelete
  http.delete<{ eventId: string; userId: string; viId: string }>(
    baseURL + '/event/:eventId/match/:viId/:userId',
    () => {
      return HttpResponse.json();
    },
  ),

  // eventNotMatchingCountGet
  http.get<{ eventId: string }, NoneType, EventNotMatchingCountGetResponse>(
    baseURL + '/event/:eventId/match/not/count',
    () => {
      return HttpResponse.json({ guide: 10, vi: 10 });
    },
  ),

  // eventNotMatchingGet
  http.get<{ eventId: string }, NoneType, EventNotMatchingGetResponse>(
    baseURL + '/event/:eventId/match/list',
    () => {
      return HttpResponse.json({
        notMatch: [
          {
            name: 'VI1',
            type: DisabilityEnum.VI,
            userId: '1312sdfs31',
            isAttended: false,
            applyRecord: RunningGroup.B,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI2',
            type: DisabilityEnum.VI,
            userId: '1312fsdsfsd31',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI3',
            type: DisabilityEnum.VI,
            userId: '131sf2bv31',
            isAttended: true,
            applyRecord: RunningGroup.C,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI4',
            type: DisabilityEnum.VI,
            userId: '13sdfsdfssfs1231',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI5',
            type: DisabilityEnum.VI,
            userId: '1sdf31ghgfcg231',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI6',
            type: DisabilityEnum.VI,
            userId: '1312sdffvbhfs31',
            isAttended: true,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI7',
            type: DisabilityEnum.VI,
            userId: '131sfssdfs2fdcv31',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드1',
            type: DisabilityEnum.GUIDE,
            userId: '13vbf42',
            isAttended: true,
            applyRecord: RunningGroup.B,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드2',
            type: DisabilityEnum.GUIDE,
            userId: '15ghtfv6',
            isAttended: true,
            applyRecord: RunningGroup.D,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드3',
            type: DisabilityEnum.GUIDE,
            userId: 'vbbxdv1',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드4',
            type: DisabilityEnum.GUIDE,

            userId: 'jrgsgdfgdyr1',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드5',
            type: DisabilityEnum.GUIDE,
            userId: '1dfgdfgerervsd',
            isAttended: true,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드6',
            type: DisabilityEnum.GUIDE,
            userId: '1663dfgdf4r',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드7',
            type: DisabilityEnum.GUIDE,
            userId: '1njsfdfgdfg',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드8',
            type: DisabilityEnum.GUIDE,
            userId: '16dfgdfwef',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드9',
            type: DisabilityEnum.GUIDE,
            userId: '1fbdfh5dfgdfg',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: '가이드10',
            type: DisabilityEnum.GUIDE,
            userId: '1gdfgrtadasda4',
            isAttended: true,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
        ],
      });
    },
  ),

  // eventMatchedViCountGet
  http.get<{ eventId: string }, NoneType, EventMatchedViCountGetResponse>(
    baseURL + '/event/:eventId/match/vi/count',
    () => {
      return HttpResponse.json({ vi: 20 });
    },
  ),

  // eventMatchedViGet
  http.get<{ eventId: string }, NoneType, EventMatchedViGetResponse>(
    baseURL + '/event/:eventId/match/vi/list',
    () => {
      return HttpResponse.json({
        vi: [
          {
            name: 'VI1',
            type: DisabilityEnum.VI,
            userId: '1312sdfs31',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI2',
            type: DisabilityEnum.VI,
            userId: '1312fsdsfsd31',
            isAttended: true,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI3',
            type: DisabilityEnum.VI,
            userId: '131sf2bv31',
            isAttended: false,
            applyRecord: RunningGroup.C,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI4',
            type: DisabilityEnum.VI,
            userId: '13sdfsdfssfs1231',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI5',
            type: DisabilityEnum.VI,
            userId: '1sdf31ghgfcg231',
            isAttended: true,
            applyRecord: RunningGroup.B,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI6',
            type: DisabilityEnum.VI,
            userId: '1312sdffvbhfs31',
            isAttended: false,
            applyRecord: RunningGroup.A,
            recordDegree: RunningGroup.A,
          },
          {
            name: 'VI7',
            type: DisabilityEnum.VI,
            userId: '131sfssdfs2fdcv31',
            isAttended: true,
            applyRecord: RunningGroup.D,
            recordDegree: RunningGroup.A,
          },
        ],
      });
    },
  ),

  // eventMatchedGuideCountGet
  http.get<
    { eventId: string; viId: string },
    NoneType,
    EventMatchedGuideCountGetResponse
  >(baseURL + '/event/:eventId/match/:viId/count', () => {
    return HttpResponse.json({ guide: 3 });
  }),

  // eventMatchedGuideGet
  http.get<
    { eventId: string; viId: string },
    NoneType,
    EventMatchedGuideGetResponse
  >(baseURL + '/event/:eventId/match/:viId/list', () => {
    return HttpResponse.json({
      guide: [
        {
          name: '가이드1',
          type: DisabilityEnum.GUIDE,
          userId: '13vbf42',
          isAttended: true,
          applyRecord: RunningGroup.A,
          recordDegree: RunningGroup.A,
        },
        {
          name: '가이드2',
          type: DisabilityEnum.GUIDE,
          userId: '15ghtfv6',
          isAttended: false,
          applyRecord: RunningGroup.A,
          recordDegree: RunningGroup.A,
        },
        {
          name: '가이드3',
          type: DisabilityEnum.GUIDE,
          userId: 'vbbxdv1',
          isAttended: false,
          applyRecord: RunningGroup.A,
          recordDegree: RunningGroup.A,
        },
      ],
    });
  }),

  //eventDelete
  http.delete<{ eventId: string }>('event/:eventId', () => {
    return HttpResponse.json();
  }),
];
