import type {
  AdditionalAnswer,
  AdditionalAnswerDetail,
  CompetitionApplicationInfo,
  EventApplicant,
  EventApplicantFormResponse,
} from '@/api/types/application';
import type {
  AdditionalQuestionType,
  EventCategory,
  EventType,
  Gender,
  RecruitStatus,
  RunningGroup,
  UserType,
} from '@/api/types/common';
import type {
  EventCreateRequest,
  EventDetailResponse,
  EventListGetResponse,
  EventUpdateRequest,
} from '@/api/types/event';
import type { MatchingUser } from '@/api/types/matching';
import type { RoleEnum } from '@/api/types/common';

export type MockUser = {
  userId: string;
  name: string;
  gender: Gender;
  phoneNumber: string;
  birthDate: string | null;
  recordDegree: RunningGroup;
  snsId: string | null;
  id1365: string | null;
  role: RoleEnum;
  type: UserType;
  accountId: string | null;
  password: string;
  detailRecord: string | null;
  hopePrefs: string | null;
  firstParticipation: boolean;
};

export type MockEvent = {
  eventId: number;
  recruitStartDate: string;
  recruitEndDate: string;
  name: string;
  eventType: EventType;
  eventCategory: EventCategory;
  recruitStatus: RecruitStatus;
  isPrivate: boolean;
  organizerId: string;
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
    dateText: string;
  };
  minNumV: number;
  minNumG: number;
  place: string;
  content: string;
  cityName?: string;
  expectedRunningDistanceKm: number | null;
  deleted?: boolean;
};

export type MockAdditionalQuestion = {
  questionId: number;
  eventId: number;
  type: AdditionalQuestionType;
  title: string;
  displayOrder: number;
  required: boolean;
  options: Array<{ optionId: number; value: string }>;
};

export type MockEventForm = {
  requestId: number;
  eventId: number;
  userId: string;
  status: 'APPLIED' | 'CANCELED';
  canceledAt: string | null;
  group: RunningGroup;
  partner: string | null;
  detail: string | null;
  competitionInfo: CompetitionApplicationInfo | null;
  additionalAnswers: AdditionalAnswer[];
  attended: boolean;
};

export type MockMatching = {
  eventId: number;
  viId: string;
  guideIds: string[];
};

export type MockComment = {
  commentId: number;
  eventId: number;
  userId: string;
  content: string;
  createdAt: string;
};

type MockDb = {
  users: MockUser[];
  events: MockEvent[];
  additionalQuestions: MockAdditionalQuestion[];
  forms: MockEventForm[];
  matchings: MockMatching[];
  comments: MockComment[];
};

export const currentUserId = 'user-vi-1';
export const runningGroups: RunningGroup[] = ['A', 'B', 'C', 'D', 'E', 'P'];

export const mockDb: MockDb = {
  users: [
    {
      userId: 'user-vi-1',
      name: 'Min Seo',
      gender: 'FEMALE',
      phoneNumber: '010-1111-2222',
      birthDate: '1994-03-12',
      recordDegree: 'A',
      snsId: 'min.runner',
      id1365: null,
      role: 'ROLE_USER',
      type: 'VI',
      accountId: 'minseo',
      password: 'password123!',
      detailRecord: '10K 58:20',
      hopePrefs: 'Steady pacing and clear verbal cues',
      firstParticipation: false,
    },
    {
      userId: 'user-guide-1',
      name: 'Joon Guide',
      gender: 'MALE',
      phoneNumber: '010-3333-4444',
      birthDate: '1991-08-02',
      recordDegree: 'A',
      snsId: 'joon.guide',
      id1365: '1365-001',
      role: 'ROLE_ADMIN',
      type: 'GUIDE',
      accountId: 'joonguide',
      password: 'password123!',
      detailRecord: 'Half marathon 1:38',
      hopePrefs: 'Can support race-day logistics',
      firstParticipation: false,
    },
    {
      userId: 'user-guide-2',
      name: 'Hana Guide',
      gender: 'FEMALE',
      phoneNumber: '010-5555-6666',
      birthDate: '1996-11-20',
      recordDegree: 'B',
      snsId: null,
      id1365: '1365-002',
      role: 'ROLE_USER',
      type: 'GUIDE',
      accountId: null,
      password: 'password123!',
      detailRecord: '5K 28:40',
      hopePrefs: 'Prefers weekend training',
      firstParticipation: true,
    },
    {
      userId: 'user-vi-2',
      name: 'Tae Runner',
      gender: 'MALE',
      phoneNumber: '010-7777-8888',
      birthDate: null,
      recordDegree: 'B',
      snsId: null,
      id1365: null,
      role: 'ROLE_USER',
      type: 'VI',
      accountId: 'taerunner',
      password: 'password123!',
      detailRecord: null,
      hopePrefs: 'Needs a guide comfortable with hills',
      firstParticipation: true,
    },
  ],
  events: [
    {
      eventId: 1,
      recruitStartDate: '2026-05-01',
      recruitEndDate: '2026-05-28',
      name: 'June Together Run',
      eventType: 'TRAINING',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: false,
      organizerId: 'user-guide-1',
      schedule: {
        date: '2026-06-01',
        startTime: '09:00',
        endTime: '11:00',
        dateText: '2026.06.01 Mon 09:00-11:00',
      },
      minNumV: 2,
      minNumG: 2,
      place: 'Olympic Park',
      content: 'Easy group training for VI runners and guides.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 5.5,
    },
    {
      eventId: 2,
      recruitStartDate: '2026-05-20',
      recruitEndDate: '2026-06-20',
      name: 'Summer 10K Race Support',
      eventType: 'COMPETITION',
      eventCategory: 'TEAM',
      recruitStatus: 'RECRUIT_UPCOMING',
      isPrivate: false,
      organizerId: 'user-guide-1',
      schedule: {
        date: '2026-07-10',
        startTime: '07:30',
        endTime: '12:00',
        dateText: '2026.07.10 Fri 07:30-12:00',
      },
      minNumV: 1,
      minNumG: 2,
      place: 'Han River Park',
      content: 'Competition support event with additional race information.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 10,
    },
    {
      eventId: 3,
      recruitStartDate: '2026-05-10',
      recruitEndDate: '2026-05-30',
      name: 'Private Pace Check',
      eventType: 'TRAINING',
      eventCategory: 'GROUP',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: true,
      organizerId: 'user-vi-1',
      schedule: {
        date: '2026-06-15',
        startTime: '19:00',
        endTime: '20:30',
        dateText: '2026.06.15 Mon 19:00-20:30',
      },
      minNumV: 1,
      minNumG: 1,
      place: 'Seoul Forest',
      content: 'Private link-only training event.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 4,
    },
    {
      eventId: 4,
      recruitStartDate: '2026-03-01',
      recruitEndDate: '2026-04-10',
      name: 'Spring Recovery Jog',
      eventType: 'TRAINING',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_END',
      isPrivate: false,
      organizerId: 'user-vi-1',
      schedule: {
        date: '2026-04-20',
        startTime: '08:00',
        endTime: '09:30',
        dateText: '2026.04.20 Mon 08:00-09:30',
      },
      minNumV: 1,
      minNumG: 1,
      place: 'World Cup Park',
      content: 'Completed event waiting for running distance input.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: null,
    },
  ],
  additionalQuestions: [
    {
      questionId: 1,
      eventId: 2,
      type: 'TEXT',
      title: 'Race memo',
      displayOrder: 1,
      required: false,
      options: [],
    },
    {
      questionId: 2,
      eventId: 2,
      type: 'SELECT',
      title: 'T-shirt size',
      displayOrder: 2,
      required: true,
      options: [
        { optionId: 21, value: 'S' },
        { optionId: 22, value: 'M' },
        { optionId: 23, value: 'L' },
      ],
    },
  ],
  forms: [
    {
      requestId: 1001,
      eventId: 1,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Hana Guide',
      detail: 'Prefer steady pace',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 1002,
      eventId: 1,
      userId: 'user-guide-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: null,
      detail: 'Can guide A or B group',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 1003,
      eventId: 1,
      userId: 'user-vi-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: null,
      detail: 'First time joining',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 2001,
      eventId: 2,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: null,
      detail: 'Need race-day guide',
      competitionInfo: {
        birthDate: '1994-03-12',
        phoneNumber: '010-1111-2222',
      },
      additionalAnswers: [
        { questionId: 1, type: 'TEXT', answerText: 'No food allergies' },
        { questionId: 2, type: 'SELECT', selectedOptionId: 22 },
      ],
      attended: false,
    },
    {
      requestId: 4001,
      eventId: 4,
      userId: 'user-guide-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: null,
      detail: null,
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
  ],
  matchings: [
    {
      eventId: 1,
      viId: 'user-vi-1',
      guideIds: ['user-guide-2'],
    },
  ],
  comments: [
    {
      commentId: 1,
      eventId: 1,
      userId: 'user-vi-1',
      content: 'Looking forward to this run.',
      createdAt: '2026-05-21T09:00:00.000Z',
    },
    {
      commentId: 2,
      eventId: 1,
      userId: 'user-guide-2',
      content: 'I can support warm-up guidance.',
      createdAt: '2026-05-21T10:00:00.000Z',
    },
  ],
};

export const findUser = (userId: string) => {
  return mockDb.users.find((user) => user.userId === userId);
};

export const getCurrentUser = () => {
  const user = findUser(currentUserId);

  if (!user) {
    throw new Error('Current mock user is missing.');
  }

  return user;
};

export const findEvent = (eventId: number) => {
  return mockDb.events.find(
    (event) => event.eventId === eventId && !event.deleted,
  );
};

export const getEventForms = (eventId: number) => {
  return mockDb.forms.filter((form) => form.eventId === eventId);
};

export const getAppliedForms = (eventId: number) => {
  return getEventForms(eventId).filter((form) => form.status === 'APPLIED');
};

export const getCanceledForms = (eventId: number) => {
  return getEventForms(eventId).filter((form) => form.status === 'CANCELED');
};

export const getFormUser = (form: MockEventForm) => {
  const user = findUser(form.userId);

  if (!user) {
    throw new Error(`Mock user ${form.userId} is missing.`);
  }

  return user;
};

export const toMatchingUser = (form: MockEventForm): MatchingUser => {
  const user = getFormUser(form);

  return {
    userId: user.userId,
    name: user.name,
    type: user.type,
    applyGroup: form.group,
  };
};

export const toApplicant = (form: MockEventForm): EventApplicant => {
  const user = getFormUser(form);

  return {
    userId: user.userId,
    name: user.name,
    type: user.type,
    isFirstParticipation: user.firstParticipation,
  };
};

export const getParticipantSummary = (forms: MockEventForm[]) => {
  const totalCount = forms.length;
  const viCount = forms.filter((form) => getFormUser(form).type === 'VI').length;
  const guideCount = totalCount - viCount;

  return { totalCount, viCount, guideCount };
};

export const getAttendanceSummary = (eventId: number) => {
  const forms = getAppliedForms(eventId);
  const attendedCount = forms.filter((form) => form.attended).length;

  return {
    waitingCount: forms.length - attendedCount,
    attendedCount,
  };
};

export const getMatching = (eventId: number, viId: string) => {
  return mockDb.matchings.find(
    (matching) => matching.eventId === eventId && matching.viId === viId,
  );
};

export const isMatched = (eventId: number, userId: string) => {
  return mockDb.matchings.some(
    (matching) =>
      matching.eventId === eventId &&
      (matching.viId === userId || matching.guideIds.includes(userId)),
  );
};

export const getMatchingSummary = (eventId: number) => {
  const appliedForms = getAppliedForms(eventId);
  const waitingForms = appliedForms.filter(
    (form) => !isMatched(eventId, form.userId),
  );
  const eventMatchings = mockDb.matchings.filter(
    (matching) => matching.eventId === eventId,
  );

  return {
    waitingCount: waitingForms.length,
    completedViCount: eventMatchings.length,
    matchedGuideCount: eventMatchings.reduce(
      (count, matching) => count + matching.guideIds.length,
      0,
    ),
  };
};

export const buildAdditionalAnswerDetails = (
  eventId: number,
  form: MockEventForm,
): AdditionalAnswerDetail[] => {
  return mockDb.additionalQuestions
    .filter((question) => question.eventId === eventId)
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((question) => {
      const answer = form.additionalAnswers.find(
        (item) => item.questionId === question.questionId,
      );

      if (question.type === 'TEXT') {
        return {
          questionId: question.questionId,
          type: 'TEXT',
          question: question.title,
          answerText:
            answer && answer.type === 'TEXT' ? answer.answerText : null,
        };
      }

      const selectedOptionId =
        answer && answer.type === 'SELECT' ? answer.selectedOptionId : null;
      const selectedOption = question.options.find(
        (option) => option.optionId === selectedOptionId,
      );

      return {
        questionId: question.questionId,
        type: 'SELECT',
        question: question.title,
        selectedOptionId,
        selectedOptionValue: selectedOption?.value ?? null,
        options: question.options,
      };
    });
};

export const buildApplicantForm = (
  eventId: number,
  userId: string,
): EventApplicantFormResponse | null => {
  const form = getEventForms(eventId).find((item) => item.userId === userId);

  if (!form) {
    return null;
  }

  const user = getFormUser(form);

  return {
    applicant: {
      userId: user.userId,
      name: user.name,
      type: user.type,
      birthDate: form.competitionInfo?.birthDate ?? user.birthDate,
      phoneNumber: form.competitionInfo?.phoneNumber ?? user.phoneNumber,
    },
    form: {
      applyGroup: form.group,
      hopePartner: form.partner,
      additionalComment: form.detail,
    },
    additionalAnswers: buildAdditionalAnswerDetails(eventId, form).map(
      (answer) => ({
        questionId: answer.questionId,
        questionTitle: answer.question,
        questionType: answer.type,
        answer:
          answer.type === 'TEXT'
            ? answer.answerText
            : answer.selectedOptionValue,
      }),
    ),
  };
};

export const toEventDetail = (event: MockEvent): EventDetailResponse => {
  const organizer = findUser(event.organizerId);
  const currentUser = getCurrentUser();
  const appliedForm = getAppliedForms(event.eventId).find(
    (form) => form.userId === currentUser.userId,
  );

  return {
    eventId: event.eventId,
    name: event.name,
    eventType: event.eventType,
    eventCategory: event.eventCategory,
    recruitStatus: event.recruitStatus,
    isPrivate: event.isPrivate,
    organizer: {
      name: organizer?.name ?? 'Unknown',
      type: organizer?.type ?? 'GUIDE',
    },
    schedule: event.schedule,
    place: event.place,
    expectedRunningDistanceKm: event.expectedRunningDistanceKm,
    content: event.content,
    viewer: {
      isApplied: Boolean(appliedForm),
      isOrganizer: event.organizerId === currentUser.userId,
    },
  };
};

export const toEventListItem = (
  event: MockEvent,
): EventListGetResponse['items'][number] => {
  return {
    id: event.eventId,
    recruitStatus:
      event.recruitStatus === 'RECRUIT_END'
        ? 'RECRUIT_CLOSE'
        : event.recruitStatus,
    name: event.name,
    type: event.eventType,
    dateText: event.schedule.dateText,
  };
};

export const createEventFromRequest = (
  body: EventCreateRequest,
): MockEvent => {
  const nextEventId = Math.max(...mockDb.events.map((event) => event.eventId)) + 1;

  return {
    eventId: nextEventId,
    recruitStartDate: body.recruitStartDate,
    recruitEndDate: body.recruitEndDate,
    name: body.name,
    eventType: body.eventType,
    eventCategory: body.eventCategory,
    recruitStatus: 'RECRUIT_OPEN',
    isPrivate: body.isPrivate ?? false,
    organizerId: currentUserId,
    schedule: {
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      dateText: `${body.date} ${body.startTime}-${body.endTime}`,
    },
    minNumV: body.minNumV,
    minNumG: body.minNumG,
    place: body.place,
    content: body.content,
    cityName: body.cityName,
    expectedRunningDistanceKm: body.expectedRunningDistanceKm ?? null,
  };
};

export const updateEventFromRequest = (
  event: MockEvent,
  body: EventUpdateRequest,
) => {
  event.recruitStartDate = body.recruitStartDate;
  event.recruitEndDate = body.recruitEndDate;
  event.name = body.name;
  event.eventType = body.eventType;
  event.eventCategory = body.eventCategory;
  event.schedule = {
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    dateText: `${body.date} ${body.startTime}-${body.endTime}`,
  };
  event.minNumV = body.minNumV;
  event.minNumG = body.minNumG;
  event.place = body.place;
  event.content = body.content;
  event.cityName = body.cityName;
  event.isPrivate = body.isPrivate;
  event.expectedRunningDistanceKm = body.expectedRunningDistanceKm ?? null;
};

export const createPage = (page: number, size: number, totalCount: number) => {
  return {
    page,
    size,
    totalCount,
    totalPages: Math.ceil(totalCount / size),
    hasNext: page * size < totalCount,
  };
};
