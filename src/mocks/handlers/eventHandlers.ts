import { http, HttpResponse, type HttpHandler } from 'msw';

import {
  EVENT_LIST_TABS,
  EVENT_LIST_TYPE_FILTERS,
  RECRUIT_STATUS_FILTERS,
} from '@/api/constants/common';
import type {
  AdditionalQuestion,
  EventCreateRequest,
  EventListGetRequest,
  EventRunningDistancePatchRequest,
  EventSearchGetRequest,
  EventUpdateRequest,
} from '@/api/types/event';
import {
  createEventFromRequest,
  createPage,
  findEvent,
  getCurrentUser,
  type MockEvent,
  mockDb,
  toEventDetail,
  toEventListItem,
  updateEventFromRequest,
} from '@/mocks/fixtures';
import {
  apiUrl,
  badRequest,
  getSearchNumber,
  getSearchString,
  hasAuthorization,
  notFound,
} from '@/mocks/http';

const today = '2026-05-22';

const getVisibleEvents = () => {
  return mockDb.events.filter((event) => !event.deleted && !event.isPrivate);
};

const filterEventList = (query: EventListGetRequest) => {
  return getVisibleEvents()
    .filter((event) => {
      if (query.tab === EVENT_LIST_TABS.UPCOMING) {
        return event.schedule.date >= today;
      }

      return event.schedule.date < today || event.recruitStatus === 'RECRUIT_END';
    })
    .filter((event) => {
      return (
        query.type === EVENT_LIST_TYPE_FILTERS.TOTAL ||
        event.eventType === query.type
      );
    })
    .filter((event) => {
      return (
        !query.recruitStatus ||
        query.recruitStatus === RECRUIT_STATUS_FILTERS.ALL ||
        event.recruitStatus === query.recruitStatus
      );
    })
    .sort((left, right) => left.schedule.date.localeCompare(right.schedule.date));
};

const createEventListResponse = (events: MockEvent[], page: number) => {
  const size = 10;
  const normalizedPage = Math.max(page, 1);
  const startIndex = (normalizedPage - 1) * size;
  const items = events.slice(startIndex, startIndex + size).map(toEventListItem);

  return {
    items,
    pagination: createPage(normalizedPage, size, events.length),
  };
};

const toDday = (date: string) => {
  const target = new Date(`${date}T00:00:00`);
  const base = new Date(`${today}T00:00:00`);

  return Math.max(0, Math.ceil((target.getTime() - base.getTime()) / 86400000));
};

const formatScheduleText = (event: MockEvent) => {
  const [year, month, day] = event.schedule.date.split('-').map(Number);
  const weekday = new Date(year, month - 1, day).toLocaleDateString('ko-KR', {
    weekday: 'short',
  });
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    return minute === 0
      ? `${period} ${displayHour}시`
      : `${period} ${displayHour}시 ${minute}분`;
  };

  return `${year}년 ${month}월 ${day}일 (${weekday}) ${formatTime(event.schedule.startTime)} ~ ${formatTime(event.schedule.endTime)}`;
};

const getUpcomingCandidateEvents = () => {
  return mockDb.events
    .filter((event) => !event.deleted)
    .filter((event) => event.schedule.date >= today)
    .filter((event) => event.recruitStatus !== 'RECRUIT_END')
    .sort((left, right) => {
      const dateCompare = left.schedule.date.localeCompare(right.schedule.date);
      if (dateCompare !== 0) return dateCompare;

      return left.schedule.startTime.localeCompare(right.schedule.startTime);
    });
};

const getApprovedCurrentUser = () => {
  const currentUser = getCurrentUser();

  return ['USER', 'COACH', 'ADMIN'].includes(currentUser.role) ? currentUser : null;
};

const isDefined = <T,>(value: T | undefined): value is T => Boolean(value);

const toPartnerItems = (partnerIds: string[]) => {
  return partnerIds
    .map((userId) => mockDb.users.find((user) => user.userId === userId))
    .filter(isDefined)
    .map((user) => ({
      type: user.type,
      name: user.name,
    }));
};

const findMyPartners = (event: MockEvent) => {
  const currentUser = getCurrentUser();
  if (event.organizerId === currentUser.userId) {
    return null;
  }

  if (currentUser.type === 'VI') {
    const matching = mockDb.matchings.find(
      (item) => item.eventId === event.eventId && item.viId === currentUser.userId,
    );
    const partners = matching ? toPartnerItems(matching.guideIds) : [];

    return partners.length > 0 ? partners : null;
  }

  const matching = mockDb.matchings.find(
    (item) =>
      item.eventId === event.eventId &&
      item.guideIds.includes(currentUser.userId),
  );
  const partners = matching ? toPartnerItems([matching.viId]) : [];

  return partners.length > 0 ? partners : null;
};

const addAdditionalQuestions = (
  eventId: number,
  additionalQuestions: AdditionalQuestion[] = [],
) => {
  let nextQuestionId =
    Math.max(0, ...mockDb.additionalQuestions.map((item) => item.questionId)) + 1;
  let nextOptionId =
    Math.max(
      0,
      ...mockDb.additionalQuestions.flatMap((item) =>
        item.options.map((option) => option.optionId),
      ),
    ) + 1;

  mockDb.additionalQuestions = mockDb.additionalQuestions.filter(
    (question) => question.eventId !== eventId,
  );

  additionalQuestions.forEach((question, index) => {
    const questionId = nextQuestionId;
    nextQuestionId += 1;

    mockDb.additionalQuestions.push({
      questionId,
      eventId,
      type: question.type,
      title: question.title,
      displayOrder: index + 1,
      required: false,
      options:
        question.type === 'SELECT'
          ? question.options.map((value) => {
              const optionId = nextOptionId;
              nextOptionId += 1;

              return { optionId, value };
            })
          : [],
    });
  });
};

export const eventHandlers: HttpHandler[] = [
  http.get(apiUrl('/event/summary'), ({ request }) => {
    const publicEvents = getVisibleEvents();
    const totalRunningDistanceKm = publicEvents.reduce(
      (sum, event) => sum + (event.expectedRunningDistanceKm ?? 0),
      0,
    );

    if (!hasAuthorization(request)) {
      return HttpResponse.json({
        publicSummary: {
          year: 2026,
          totalEventCount: publicEvents.length,
          totalRunningDistanceKm,
        },
        mySummary: null,
      });
    }

    const currentUser = getCurrentUser();
    const myForms = mockDb.forms.filter(
      (form) => form.userId === currentUser.userId && form.status === 'APPLIED',
    );
    const myDistance = myForms.reduce((sum, form) => {
      const event = findEvent(form.eventId);

      return sum + (event?.expectedRunningDistanceKm ?? 0);
    }, 0);

    return HttpResponse.json({
      publicSummary: {
        year: 2026,
        totalEventCount: publicEvents.length,
        totalRunningDistanceKm,
      },
      mySummary: {
        totalParticipationCount: myForms.length,
        totalRunningDistanceKm: myDistance,
      },
    });
  }),

  http.get(apiUrl('/event/upcoming'), ({ request }) => {
    const guestItems = getUpcomingCandidateEvents()
      .filter((event) => !event.isPrivate)
      .slice(0, 5)
      .map((event) => ({
        id: event.eventId,
        name: event.name,
        dDay: toDday(event.schedule.date),
        date: event.schedule.date,
      }));

    if (!hasAuthorization(request)) {
      return HttpResponse.json({
        viewerType: 'GUEST',
        items: guestItems,
      });
    }

    const currentUser = getApprovedCurrentUser();
    if (!currentUser) {
      return HttpResponse.json({
        viewerType: 'GUEST',
        items: guestItems,
      });
    }

    const myAppliedEventIds = new Set(
      mockDb.forms
        .filter(
          (form) =>
            form.userId === currentUser.userId && form.status === 'APPLIED',
        )
        .map((form) => form.eventId),
    );

    return HttpResponse.json({
      viewerType: 'MEMBER',
      items: getUpcomingCandidateEvents()
        .filter(
          (event) =>
            myAppliedEventIds.has(event.eventId) ||
            event.organizerId === currentUser.userId,
        )
        .slice(0, 5)
        .map((event) => ({
          id: event.eventId,
          name: event.name,
          dDay: toDday(event.schedule.date),
          place: event.place,
          scheduleText: formatScheduleText(event),
          myPartner: findMyPartners(event),
        })),
    });
  }),

  http.get(apiUrl('/event/all'), ({ request }) => {
    const query: EventListGetRequest = {
      tab: getSearchString(
        request,
        'tab',
        EVENT_LIST_TABS.UPCOMING,
      ) as EventListGetRequest['tab'],
      type: getSearchString(
        request,
        'type',
        EVENT_LIST_TYPE_FILTERS.TOTAL,
      ) as EventListGetRequest['type'],
      recruitStatus: getSearchString(
        request,
        'recruitStatus',
        RECRUIT_STATUS_FILTERS.ALL,
      ) as EventListGetRequest['recruitStatus'],
      page: getSearchNumber(request, 'page', 1),
    };

    return HttpResponse.json(createEventListResponse(filterEventList(query), query.page));
  }),

  http.get(apiUrl('/event/search'), ({ request }) => {
    const query: EventSearchGetRequest = {
      keyword: getSearchString(request, 'keyword'),
      tab: getSearchString(
        request,
        'tab',
        EVENT_LIST_TABS.UPCOMING,
      ) as EventSearchGetRequest['tab'],
      type: getSearchString(
        request,
        'type',
        EVENT_LIST_TYPE_FILTERS.TOTAL,
      ) as EventSearchGetRequest['type'],
      recruitStatus: getSearchString(
        request,
        'recruitStatus',
        RECRUIT_STATUS_FILTERS.ALL,
      ) as EventSearchGetRequest['recruitStatus'],
      page: getSearchNumber(request, 'page', 1),
    };
    const events = filterEventList(query).filter((event) =>
      event.name.toLowerCase().includes(query.keyword.toLowerCase()),
    );

    return HttpResponse.json(createEventListResponse(events, query.page));
  }),

  http.post(apiUrl('/event'), async ({ request }) => {
    const body = (await request.json()) as EventCreateRequest;

    if (!body.name) {
      return badRequest('name is required.');
    }

    const event = createEventFromRequest(body);

    mockDb.events.push(event);
    addAdditionalQuestions(event.eventId, body.additionalQuestions);

    return HttpResponse.json({
      eventId: event.eventId,
      isApprove: true,
    });
  }),

  http.get(apiUrl('/event/missing-running-distance'), () => {
    const currentUser = getCurrentUser();

    return HttpResponse.json({
      items: mockDb.events
        .filter(
          (event) =>
            !event.deleted &&
            !event.runningDistanceSkipped &&
            event.organizerId === currentUser.userId &&
            event.recruitStatus === 'RECRUIT_END' &&
            event.expectedRunningDistanceKm === null,
        )
        .map((event) => ({
          eventId: event.eventId,
          name: event.name,
          dateText: event.schedule.dateText,
        })),
    });
  }),

  http.patch<{ eventId: string }>(
    apiUrl('/event/:eventId/running-distance'),
    async ({ params, request }) => {
      const event = findEvent(Number(params.eventId));
      const body = (await request.json()) as EventRunningDistancePatchRequest;

      if (!event) {
        return notFound('Event not found.');
      }

      event.expectedRunningDistanceKm = body.expectedRunningDistanceKm;

      return HttpResponse.json({
        eventId: event.eventId,
        expectedRunningDistanceKm: event.expectedRunningDistanceKm,
      });
    },
  ),

  http.patch<{ eventId: string }>(
    apiUrl('/event/:eventId/running-distance/skip'),
    ({ params }) => {
      const event = findEvent(Number(params.eventId));

      if (!event) {
        return notFound('Event not found.');
      }

      event.runningDistanceSkipped = true;

      return HttpResponse.json({
        eventId: event.eventId,
        isSkipped: event.runningDistanceSkipped,
      });
    },
  ),

  http.patch<{ eventId: string }>(
    apiUrl('/event/close/:eventId'),
    ({ params }) => {
      const event = findEvent(Number(params.eventId));

      if (!event) {
        return notFound('Event not found.');
      }

      event.recruitStatus = 'RECRUIT_CLOSE';

      return new HttpResponse('', { status: 200 });
    },
  ),

  http.get<{ eventId: string }>(apiUrl('/event/:eventId'), ({ params }) => {
    const event = findEvent(Number(params.eventId));

    if (!event) {
      return notFound('Event not found.');
    }

    return HttpResponse.json(toEventDetail(event));
  }),

  http.patch<{ eventId: string }>(
    apiUrl('/event/:eventId'),
    async ({ params, request }) => {
      const event = findEvent(Number(params.eventId));
      const body = (await request.json()) as EventUpdateRequest;

      if (!event) {
        return notFound('Event not found.');
      }

      updateEventFromRequest(event, body);

      return HttpResponse.json({
        eventId: event.eventId,
        isApprove: true,
      });
    },
  ),

  http.delete<{ eventId: string }>(apiUrl('/event/:eventId'), ({ params }) => {
    const event = findEvent(Number(params.eventId));

    if (!event) {
      return notFound('Event not found.');
    }

    event.deleted = true;

    return new HttpResponse(null, { status: 204 });
  }),
];
