import { http, HttpResponse, type HttpHandler } from 'msw';

import { EVENT_LIST_TYPE_FILTERS } from '@/api/constants/common';
import {
  MY_ACTIVITY_EVENT_RELATION_FILTERS,
  MY_ACTIVITY_PARTNER_SORTS,
} from '@/api/constants/user';
import type {
  CheckAccountDuplicatedRequest,
  MyActivityEventsQuery,
  MyActivityPartnersQuery,
  SetAccountRequest,
  UpdatePersonalInfoRequest,
  UpdateRunningInfoRequest,
  UserBirthDatePatchRequest,
  UserWithdrawalDeleteRequest,
} from '@/api/types/user';
import {
  createPage,
  findEvent,
  findUser,
  getCurrentUser,
  type MockEvent,
  mockDb,
} from '@/mocks/fixtures';
import {
  apiUrl,
  badRequest,
  conflict,
  getSearchNumber,
  getSearchString,
  noContent,
  requireAuthorization,
} from '@/mocks/http';

const toActivityEventItem = (event: MockEvent) => {
  return {
    id: event.eventId,
    name: event.name,
    type: event.eventType,
    date: event.schedule.date,
    dateText: event.schedule.dateText,
  };
};

const createActivityEventsResponse = (events: MockEvent[], page: number) => {
  const size = 10;
  const startIndex = (page - 1) * size;

  return {
    items: events.slice(startIndex, startIndex + size).map(toActivityEventItem),
    pagination: createPage(page, size, events.length),
  };
};

const deduplicateEvents = (events: MockEvent[]) => {
  return Array.from(
    events.reduce((eventMap, event) => {
      eventMap.set(event.eventId, event);

      return eventMap;
    }, new Map<number, MockEvent>()),
  ).map(([, event]) => event);
};

export const userHandlers: HttpHandler[] = [
  http.get(apiUrl('/user/personal'), ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const user = getCurrentUser();

    return HttpResponse.json({
      name: user.name,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      recordDegree: user.recordDegree,
      snsId: user.snsId,
      id1365: user.id1365,
      userId: user.userId,
      role: user.role,
      type: user.type,
    });
  }),

  http.patch(apiUrl('/user/personal/birth-date'), async ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as UserBirthDatePatchRequest;
    const user = getCurrentUser();

    user.birthDate = body.birthDate;

    return HttpResponse.json({ birthDate: user.birthDate });
  }),

  http.get(apiUrl('/user/mypage'), ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const user = getCurrentUser();
    const myForms = mockDb.forms.filter(
      (form) => form.userId === user.userId && form.status === 'APPLIED',
    );
    const myEvents = myForms
      .map((form) => mockDb.events.find((event) => event.eventId === form.eventId))
      .filter((event) => event && !event.deleted);

    return HttpResponse.json({
      profile: {
        name: user.name,
        gender: user.gender,
        type: user.type,
        recordDegree: user.recordDegree,
      },
      participation: {
        totalCount: myEvents.length,
        competitionCount: myEvents.filter(
          (event) => event?.eventType === EVENT_LIST_TYPE_FILTERS.COMPETITION,
        ).length,
        trainingCount: myEvents.filter(
          (event) => event?.eventType === EVENT_LIST_TYPE_FILTERS.TRAINING,
        ).length,
      },
      personalInfo: {
        birthDate: user.birthDate,
        phoneNumber: user.phoneNumber,
        snsId: user.snsId,
        id1365: user.id1365,
        accountId: user.accountId,
      },
      runningInfo: {
        type: user.type,
        recordDegree: user.recordDegree,
        detailRecord: user.detailRecord,
        hopePrefs: user.hopePrefs,
      },
    });
  }),

  http.get(apiUrl('/user/activity/events'), ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const user = getCurrentUser();
    const type = getSearchString(
      request,
      'type',
      EVENT_LIST_TYPE_FILTERS.TOTAL,
    ) as MyActivityEventsQuery['type'];
    const relation = getSearchString(
      request,
      'relation',
      MY_ACTIVITY_EVENT_RELATION_FILTERS.TOTAL,
    ) as MyActivityEventsQuery['relation'];
    const page = getSearchNumber(request, 'page', 1);
    const participatedEvents = mockDb.forms
      .filter((form) => form.userId === user.userId && form.status === 'APPLIED')
      .map((form) => findEvent(form.eventId))
      .filter((event): event is MockEvent => event !== undefined);
    const hostedEvents = mockDb.events.filter(
      (event) => !event.deleted && event.organizerId === user.userId,
    );

    const events = deduplicateEvents(
      relation === MY_ACTIVITY_EVENT_RELATION_FILTERS.PARTICIPATED
        ? participatedEvents
        : relation === MY_ACTIVITY_EVENT_RELATION_FILTERS.HOSTED
          ? hostedEvents
          : [...participatedEvents, ...hostedEvents],
    )
      .filter(
        (event) =>
          type === EVENT_LIST_TYPE_FILTERS.TOTAL || event.eventType === type,
      )
      .sort((left, right) => right.schedule.date.localeCompare(left.schedule.date));

    return HttpResponse.json(createActivityEventsResponse(events, page));
  }),

  http.get(apiUrl('/user/activity/partners'), ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const user = getCurrentUser();
    const sort = getSearchString(
      request,
      'sort',
      MY_ACTIVITY_PARTNER_SORTS.RECENT,
    ) as MyActivityPartnersQuery['sort'];
    const page = getSearchNumber(request, 'page', 1);
    const partnerEvents = new Map<
      string,
      {
        events: MockEvent[];
        partner: NonNullable<ReturnType<typeof findUser>>;
      }
    >();

    mockDb.matchings.forEach((matching) => {
      const event = findEvent(matching.eventId);

      if (!event) {
        return;
      }

      const partnerIds =
        matching.viId === user.userId
          ? matching.guideIds
          : matching.guideIds.includes(user.userId)
            ? [matching.viId]
            : [];

      partnerIds.forEach((partnerId) => {
        const partner = findUser(partnerId);

        if (!partner) {
          return;
        }

        const entry = partnerEvents.get(partner.userId) ?? {
          events: [],
          partner,
        };

        if (!entry.events.some((item) => item.eventId === event.eventId)) {
          entry.events.push(event);
        }

        partnerEvents.set(partner.userId, entry);
      });
    });

    const sortEvents = (events: MockEvent[]) => {
      return [...events].sort((left, right) => {
        return sort === MY_ACTIVITY_PARTNER_SORTS.OLD
          ? left.schedule.date.localeCompare(right.schedule.date)
          : right.schedule.date.localeCompare(left.schedule.date);
      });
    };
    const partners = Array.from(partnerEvents.values())
      .map(({ events, partner }) => {
        const sortedEvents = sortEvents(events);

        return {
          partnerId: partner.userId,
          name: partner.name,
          type: partner.type,
          eventCount: sortedEvents.length,
          events: sortedEvents.map((event) => ({
            id: event.eventId,
            name: event.name,
            date: event.schedule.date,
            dateText: event.schedule.dateText,
          })),
          sortDate: sortedEvents[0]?.schedule.date ?? '',
        };
      })
      .sort((left, right) => {
        return sort === MY_ACTIVITY_PARTNER_SORTS.OLD
          ? left.sortDate.localeCompare(right.sortDate)
          : right.sortDate.localeCompare(left.sortDate);
      });
    const size = 5;
    const startIndex = (page - 1) * size;

    return HttpResponse.json({
      items: partners.slice(startIndex, startIndex + size).map((partner) => ({
        partnerId: partner.partnerId,
        name: partner.name,
        type: partner.type,
        eventCount: partner.eventCount,
        events: partner.events,
      })),
      pagination: createPage(page, size, partners.length),
    });
  }),

  http.patch(apiUrl('/user/personal'), async ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as UpdatePersonalInfoRequest;
    const user = getCurrentUser();

    if (user.type === 'VI' && body.id1365) {
      return badRequest('VI users cannot update id1365.');
    }

    user.birthDate = body.birthDate;
    user.phoneNumber = body.phoneNumber;
    user.snsId = body.snsId;
    user.id1365 = body.id1365 ?? null;

    return HttpResponse.json({
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber,
      snsId: user.snsId,
      id1365: user.id1365,
    });
  }),

  http.patch(apiUrl('/user/running'), async ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as UpdateRunningInfoRequest;
    const user = getCurrentUser();

    user.recordDegree = body.recordDegree;
    user.detailRecord = body.detailRecord;
    user.hopePrefs = body.hopePrefs;

    return HttpResponse.json({
      type: user.type,
      recordDegree: user.recordDegree,
      detailRecord: user.detailRecord,
      hopePrefs: user.hopePrefs,
    });
  }),

  http.post(apiUrl('/user/account'), async ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as SetAccountRequest;
    const user = getCurrentUser();

    if (user.accountId) {
      return conflict('accountId is already set.');
    }

    if (mockDb.users.some((item) => item.accountId === body.accountId)) {
      return conflict('accountId is already in use.');
    }

    user.accountId = body.accountId;
    user.password = body.password;

    return HttpResponse.json({ accountId: user.accountId });
  }),

  http.post(apiUrl('/user/account/duplicated'), async ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as CheckAccountDuplicatedRequest;

    return HttpResponse.json({
      isUnique: !mockDb.users.some((user) => user.accountId === body.accountId),
    });
  }),

  http.delete(apiUrl('/user'), async ({ request }) => {
    const authError = requireAuthorization(request);

    if (authError) {
      return authError;
    }

    const body = (await request.json()) as UserWithdrawalDeleteRequest;
    const user = getCurrentUser();

    if (!Array.isArray(body.reasons)) {
      return badRequest('reasons must be an array.');
    }

    user.role = 'ROLE_WITHDRAWAL';

    return noContent();
  }),
];
