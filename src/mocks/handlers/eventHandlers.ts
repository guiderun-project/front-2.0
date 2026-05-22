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
  const startIndex = (page - 1) * size;
  const items = events.slice(startIndex, startIndex + size).map(toEventListItem);

  return {
    items,
    pagination: createPage(page, size, events.length),
  };
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
    const currentUser = getCurrentUser();

    if (!hasAuthorization(request)) {
      return HttpResponse.json({
        viewerType: 'GUEST',
        items: getVisibleEvents()
          .filter((event) => event.schedule.date >= today)
          .slice(0, 5)
          .map((event) => ({
            id: event.eventId,
            name: event.name,
            dDay: 10,
            date: event.schedule.date,
          })),
      });
    }

    return HttpResponse.json({
      viewerType: 'MEMBER',
      items: mockDb.forms
        .filter(
          (form) =>
            form.userId === currentUser.userId && form.status === 'APPLIED',
        )
        .map((form) => findEvent(form.eventId))
        .filter((event): event is MockEvent => {
          return event !== undefined && event.schedule.date >= today;
        })
        .map((event) => ({
          id: event.eventId,
          name: event.name,
          dDay: 10,
          place: event.place,
          scheduleText: event.schedule.dateText,
          myPartner: null,
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
      addAdditionalQuestions(event.eventId, body.additionalQuestions);

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
