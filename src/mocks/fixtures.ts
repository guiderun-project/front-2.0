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
  AdditionalQuestionDetail,
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
  runningDistanceSkipped?: boolean;
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

export const DEFAULT_MOCK_SESSION_USER_ID = 'user-vi-1';

let mockSessionUserId = DEFAULT_MOCK_SESSION_USER_ID;

export const setMockSessionUser = (userId: string) => {
  mockSessionUserId = userId;
};

export const resetMockSessionUser = () => {
  mockSessionUserId = DEFAULT_MOCK_SESSION_USER_ID;
};
export const runningGroups: RunningGroup[] = ['A', 'B', 'C', 'D', 'E', 'P'];
export const visibleRunningGroups: RunningGroup[] = ['A', 'B', 'C', 'D', 'E'];

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
      role: 'USER',
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
      role: 'ADMIN',
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
      role: 'USER',
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
      role: 'USER',
      type: 'VI',
      accountId: 'taerunner',
      password: 'password123!',
      detailRecord: null,
      hopePrefs: 'Needs a guide comfortable with hills',
      firstParticipation: true,
    },
    {
      userId: 'user-vi-3',
      name: 'Sora Runner',
      gender: 'FEMALE',
      phoneNumber: '010-2222-3333',
      birthDate: '1998-04-18',
      recordDegree: 'C',
      snsId: null,
      id1365: null,
      role: 'USER',
      type: 'VI',
      accountId: 'sorarunner',
      password: 'password123!',
      detailRecord: '5K 34:10',
      hopePrefs: 'Prefers detailed route previews',
      firstParticipation: false,
    },
    {
      userId: 'user-guide-3',
      name: 'Mina Guide',
      gender: 'FEMALE',
      phoneNumber: '010-4444-5555',
      birthDate: '1993-09-07',
      recordDegree: 'C',
      snsId: 'mina.guide',
      id1365: '1365-003',
      role: 'USER',
      type: 'GUIDE',
      accountId: 'minaguide',
      password: 'password123!',
      detailRecord: '10K 1:02:30',
      hopePrefs: 'Can guide beginner training sessions',
      firstParticipation: true,
    },
    {
      userId: 'user-guide-4',
      name: 'Eun Guide',
      gender: 'FEMALE',
      phoneNumber: '010-8888-1111',
      birthDate: '1995-01-19',
      recordDegree: 'B',
      snsId: 'eun.guide',
      id1365: '1365-004',
      role: 'USER',
      type: 'GUIDE',
      accountId: 'eunguide',
      password: 'password123!',
      detailRecord: '10K 53:20',
      hopePrefs: 'Comfortable with first-time VI runners',
      firstParticipation: false,
    },
    {
      userId: 'user-guide-5',
      name: 'Doyun Guide',
      gender: 'MALE',
      phoneNumber: '010-9999-2222',
      birthDate: '1990-12-03',
      recordDegree: 'C',
      snsId: null,
      id1365: '1365-005',
      role: 'USER',
      type: 'GUIDE',
      accountId: 'doyunguide',
      password: 'password123!',
      detailRecord: 'Half marathon 2:04',
      hopePrefs: 'Can support slower pace groups',
      firstParticipation: false,
    },
    {
      userId: 'user-guide-6',
      name: 'Yuri Guide',
      gender: 'FEMALE',
      phoneNumber: '010-1010-2020',
      birthDate: '1992-10-14',
      recordDegree: 'A',
      snsId: 'yuri.guide',
      id1365: '1365-006',
      role: 'USER',
      type: 'GUIDE',
      accountId: 'yuriguide',
      password: 'password123!',
      detailRecord: '10K 51:45',
      hopePrefs: 'Comfortable with evening runs and steady tempo',
      firstParticipation: false,
    },
    {
      userId: 'user-guide-7',
      name: 'Kevin Guide',
      gender: 'MALE',
      phoneNumber: '010-3030-4040',
      birthDate: '1989-05-27',
      recordDegree: 'B',
      snsId: null,
      id1365: '1365-007',
      role: 'USER',
      type: 'GUIDE',
      accountId: 'kevinguide',
      password: 'password123!',
      detailRecord: 'Half marathon 1:55',
      hopePrefs: 'Can guide bridge and riverside routes',
      firstParticipation: true,
    },
    {
      userId: 'user-guide-8',
      name: 'Nari Guide',
      gender: 'FEMALE',
      phoneNumber: '010-5050-6060',
      birthDate: '1999-02-08',
      recordDegree: 'D',
      snsId: 'nari.guide',
      id1365: '1365-008',
      role: 'USER',
      type: 'GUIDE',
      accountId: 'nariguide',
      password: 'password123!',
      detailRecord: '5K 32:05',
      hopePrefs: 'Prefers beginner-friendly training',
      firstParticipation: true,
    },
    {
      userId: 'user-vi-4',
      name: 'Ara Runner',
      gender: 'FEMALE',
      phoneNumber: '010-1212-3434',
      birthDate: '1997-06-09',
      recordDegree: 'A',
      snsId: 'ara.runner',
      id1365: null,
      role: 'USER',
      type: 'VI',
      accountId: 'ararunner',
      password: 'password123!',
      detailRecord: '10K 49:30',
      hopePrefs: 'Prefers concise pace updates',
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
      organizerId: DEFAULT_MOCK_SESSION_USER_ID,
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
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_OPEN',
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
      organizerId: DEFAULT_MOCK_SESSION_USER_ID,
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
      organizerId: DEFAULT_MOCK_SESSION_USER_ID,
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
    {
      eventId: 5,
      recruitStartDate: '2026-05-10',
      recruitEndDate: '2026-05-24',
      name: 'Sunset Riverside Run',
      eventType: 'TRAINING',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: false,
      organizerId: 'user-guide-1',
      schedule: {
        date: '2026-05-25',
        startTime: '18:00',
        endTime: '19:30',
        dateText: '2026.05.25 Mon 18:00-19:30',
      },
      minNumV: 2,
      minNumG: 2,
      place: 'Ttukseom Hangang Park',
      content: 'Easy sunset pace run along the river.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 6,
    },
    {
      eventId: 6,
      recruitStartDate: '2026-05-12',
      recruitEndDate: '2026-05-29',
      name: 'Early Bird Track Day',
      eventType: 'TRAINING',
      eventCategory: 'GROUP',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: false,
      organizerId: 'user-guide-1',
      schedule: {
        date: '2026-05-30',
        startTime: '06:30',
        endTime: '08:00',
        dateText: '2026.05.30 Sat 06:30-08:00',
      },
      minNumV: 1,
      minNumG: 2,
      place: 'Jamsil Sports Complex',
      content: 'Interval training session on the track.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 8,
    },
    {
      eventId: 7,
      recruitStartDate: '2026-05-20',
      recruitEndDate: '2026-06-05',
      name: 'Forest Trail Meetup',
      eventType: 'TRAINING',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: false,
      organizerId: DEFAULT_MOCK_SESSION_USER_ID,
      schedule: {
        date: '2026-06-08',
        startTime: '09:00',
        endTime: '11:00',
        dateText: '2026.06.08 Mon 09:00-11:00',
      },
      minNumV: 2,
      minNumG: 3,
      place: 'Seoul Forest',
      content: 'Relaxed trail run for all paces.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 7,
    },
    {
      eventId: 8,
      recruitStartDate: '2026-05-22',
      recruitEndDate: '2026-06-18',
      name: 'Midsummer Night 5K',
      eventType: 'COMPETITION',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: false,
      organizerId: 'user-guide-1',
      schedule: {
        date: '2026-06-20',
        startTime: '20:00',
        endTime: '22:00',
        dateText: '2026.06.20 Sat 20:00-22:00',
      },
      minNumV: 1,
      minNumG: 1,
      place: 'Banpo Hangang Park',
      content: 'Evening 5K race support event.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 5,
    },
    {
      eventId: 9,
      recruitStartDate: '2026-05-24',
      recruitEndDate: '2026-06-08',
      name: 'Wednesday Partner Tempo',
      eventType: 'TRAINING',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: false,
      organizerId: 'user-guide-2',
      schedule: {
        date: '2026-06-10',
        startTime: '19:30',
        endTime: '21:00',
        dateText: '2026.06.10 Wed 19:30-21:00',
      },
      minNumV: 1,
      minNumG: 2,
      place: 'Yeouido Hangang Park',
      content: 'Tempo run with familiar guide partners.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 6,
    },
    {
      eventId: 10,
      recruitStartDate: '2026-05-26',
      recruitEndDate: '2026-06-10',
      name: 'Friday Easy Loop',
      eventType: 'TRAINING',
      eventCategory: 'GROUP',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: false,
      organizerId: DEFAULT_MOCK_SESSION_USER_ID,
      schedule: {
        date: '2026-06-12',
        startTime: '20:00',
        endTime: '21:10',
        dateText: '2026.06.12 Fri 20:00-21:10',
      },
      minNumV: 1,
      minNumG: 2,
      place: 'Seoul Forest',
      content: 'Low-intensity loop for partner coordination practice.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 5,
    },
    {
      eventId: 11,
      recruitStartDate: '2026-05-30',
      recruitEndDate: '2026-06-16',
      name: 'Bridge Pace Check',
      eventType: 'TRAINING',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_OPEN',
      isPrivate: false,
      organizerId: 'user-guide-1',
      schedule: {
        date: '2026-06-18',
        startTime: '07:00',
        endTime: '08:30',
        dateText: '2026.06.18 Thu 07:00-08:30',
      },
      minNumV: 1,
      minNumG: 2,
      place: 'Banpo Bridge',
      content: 'Short bridge route focused on verbal cue timing.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 4.5,
    },
    {
      eventId: 12,
      recruitStartDate: '2026-06-01',
      recruitEndDate: '2026-06-25',
      name: 'Weekend Long Slow Distance',
      eventType: 'TRAINING',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_UPCOMING',
      isPrivate: false,
      organizerId: 'user-guide-6',
      schedule: {
        date: '2026-06-27',
        startTime: '08:00',
        endTime: '10:00',
        dateText: '2026.06.27 Sat 08:00-10:00',
      },
      minNumV: 1,
      minNumG: 2,
      place: 'Nanji Hangang Park',
      content: 'Long slow distance session with rotating guide pairs.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 9,
    },
    {
      eventId: 13,
      recruitStartDate: '2026-06-04',
      recruitEndDate: '2026-06-29',
      name: 'July Opening Track Run',
      eventType: 'TRAINING',
      eventCategory: 'GROUP',
      recruitStatus: 'RECRUIT_UPCOMING',
      isPrivate: false,
      organizerId: 'user-guide-7',
      schedule: {
        date: '2026-07-01',
        startTime: '06:30',
        endTime: '08:00',
        dateText: '2026.07.01 Wed 06:30-08:00',
      },
      minNumV: 1,
      minNumG: 2,
      place: 'Mokdong Stadium',
      content: 'Track session for early July pacing.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 7,
    },
    {
      eventId: 14,
      recruitStartDate: '2026-06-08',
      recruitEndDate: '2026-07-03',
      name: 'Monday Recovery Crew',
      eventType: 'TRAINING',
      eventCategory: 'GENERAL',
      recruitStatus: 'RECRUIT_UPCOMING',
      isPrivate: false,
      organizerId: 'user-guide-8',
      schedule: {
        date: '2026-07-06',
        startTime: '19:00',
        endTime: '20:30',
        dateText: '2026.07.06 Mon 19:00-20:30',
      },
      minNumV: 1,
      minNumG: 3,
      place: 'Gwangnaru Hangang Park',
      content: 'Recovery run with several familiar guide partners.',
      cityName: 'SEOUL',
      expectedRunningDistanceKm: 5.5,
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
    {
      questionId: 10,
      eventId: 1,
      type: 'TEXT',
      title: '먹고 싶은 음식',
      displayOrder: 1,
      required: false,
      options: [],
    },
    {
      questionId: 11,
      eventId: 1,
      type: 'SELECT',
      title: '지원 가능한 페이스',
      displayOrder: 2,
      required: false,
      options: [
        { optionId: 111, value: 'A/B 그룹' },
        { optionId: 112, value: 'C/D 그룹' },
        { optionId: 113, value: '모든 그룹' },
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
      requestId: 1004,
      eventId: 1,
      userId: 'user-guide-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: null,
      detail: 'Can support as an additional guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 1005,
      eventId: 1,
      userId: 'user-vi-3',
      status: 'APPLIED',
      canceledAt: null,
      group: 'C',
      partner: 'Mina Guide',
      detail: '처음 보는 길에서는 코스 설명을 자세히 부탁드려요',
      competitionInfo: null,
      additionalAnswers: [
        { questionId: 10, type: 'TEXT', answerText: '치즈버거, 설렁탕' },
        { questionId: 11, type: 'SELECT', selectedOptionId: 112 },
      ],
      attended: false,
    },
    {
      requestId: 1006,
      eventId: 1,
      userId: 'user-guide-3',
      status: 'APPLIED',
      canceledAt: null,
      group: 'C',
      partner: 'Sora Runner',
      detail: '초보 러너와 천천히 뛰는 훈련 지원 가능',
      competitionInfo: null,
      additionalAnswers: [
        { questionId: 10, type: 'TEXT', answerText: '샌드위치' },
        { questionId: 11, type: 'SELECT', selectedOptionId: 113 },
      ],
      attended: false,
    },
    {
      requestId: 1007,
      eventId: 1,
      userId: 'user-guide-4',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: 'Tae Runner',
      detail: null,
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 1008,
      eventId: 1,
      userId: 'user-guide-5',
      status: 'APPLIED',
      canceledAt: null,
      group: 'C',
      partner: null,
      detail: '마지막 1km는 페이스를 올리기보다 안전하게 마무리하는 편을 선호합니다.',
      competitionInfo: null,
      additionalAnswers: [
        { questionId: 10, type: 'TEXT', answerText: '커리, 김밥' },
        { questionId: 11, type: 'SELECT', selectedOptionId: 112 },
      ],
      attended: false,
    },
    {
      requestId: 1009,
      eventId: 1,
      userId: 'user-vi-4',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: null,
      detail: null,
      competitionInfo: null,
      additionalAnswers: [
        { questionId: 11, type: 'SELECT', selectedOptionId: 111 },
      ],
      attended: false,
    },
    {
      requestId: 2001,
      eventId: 2,
      userId: 'user-vi-2',
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
      requestId: 3001,
      eventId: 3,
      userId: 'user-guide-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: null,
      detail: 'Private pace check guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
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
    {
      requestId: 4002,
      eventId: 4,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: null,
      detail: 'Prefers steady pacing cues',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 4003,
      eventId: 4,
      userId: 'user-guide-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: null,
      detail: 'Can support warm-up guidance',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 4004,
      eventId: 4,
      userId: 'user-vi-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: null,
      detail: 'Needs clear uphill guidance',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 4005,
      eventId: 4,
      userId: 'user-vi-3',
      status: 'CANCELED',
      canceledAt: '2026-05-24T11:30:00.000Z',
      group: 'C',
      partner: null,
      detail: 'Schedule changed',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 4006,
      eventId: 4,
      userId: 'user-guide-3',
      status: 'CANCELED',
      canceledAt: '2026-05-25T08:15:00.000Z',
      group: 'C',
      partner: null,
      detail: 'Personal appointment',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 7001,
      eventId: 7,
      userId: 'user-vi-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: 'Eun Guide',
      detail: '숲길에서는 왼쪽 장애물 안내를 자주 부탁드려요',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 7002,
      eventId: 7,
      userId: 'user-guide-4',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: null,
      detail: '트레일 코스 경험 있음',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 7003,
      eventId: 7,
      userId: 'user-vi-3',
      status: 'APPLIED',
      canceledAt: null,
      group: 'C',
      partner: null,
      detail: null,
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 7004,
      eventId: 7,
      userId: 'user-guide-5',
      status: 'APPLIED',
      canceledAt: null,
      group: 'C',
      partner: 'Sora Runner',
      detail: 'C그룹 보조 가이드 가능',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 7005,
      eventId: 7,
      userId: 'user-guide-3',
      status: 'APPLIED',
      canceledAt: null,
      group: 'C',
      partner: null,
      detail: '서브 가이드로 참여 가능',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 5001,
      eventId: 5,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Hana Guide',
      detail: 'Prefer relaxed riverside pace',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 5002,
      eventId: 5,
      userId: 'user-guide-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Can guide riverside turns',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 6001,
      eventId: 6,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Hana Guide',
      detail: 'Wants clear interval count cues',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 6002,
      eventId: 6,
      userId: 'user-guide-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Track interval guide available',
      competitionInfo: null,
      additionalAnswers: [],
      attended: true,
    },
    {
      requestId: 9001,
      eventId: 9,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Hana Guide, Mina Guide',
      detail: 'Tempo run with two guides',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 9002,
      eventId: 9,
      userId: 'user-guide-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Lead guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 9003,
      eventId: 9,
      userId: 'user-guide-3',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Sub guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 10001,
      eventId: 10,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Hana Guide, Eun Guide',
      detail: 'Easy loop with familiar guides',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 10002,
      eventId: 10,
      userId: 'user-guide-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Lead guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 10003,
      eventId: 10,
      userId: 'user-guide-4',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Sub guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 11001,
      eventId: 11,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Joon Guide, Doyun Guide',
      detail: 'Bridge route cue practice',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 11002,
      eventId: 11,
      userId: 'user-guide-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Lead guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 11003,
      eventId: 11,
      userId: 'user-guide-5',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Sub guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 12001,
      eventId: 12,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Mina Guide, Yuri Guide',
      detail: 'Long slow distance pace check',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 12002,
      eventId: 12,
      userId: 'user-guide-3',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Lead guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 12003,
      eventId: 12,
      userId: 'user-guide-6',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Sub guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 13001,
      eventId: 13,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: 'Eun Guide, Kevin Guide',
      detail: 'Track run with bridge cue review',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 13002,
      eventId: 13,
      userId: 'user-guide-4',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: 'Min Seo',
      detail: 'Lead guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 13003,
      eventId: 13,
      userId: 'user-guide-7',
      status: 'APPLIED',
      canceledAt: null,
      group: 'B',
      partner: 'Min Seo',
      detail: 'Sub guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 14001,
      eventId: 14,
      userId: 'user-vi-1',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Hana Guide, Yuri Guide, Nari Guide',
      detail: 'Recovery run with three guide partners',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 14002,
      eventId: 14,
      userId: 'user-guide-2',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Lead guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 14003,
      eventId: 14,
      userId: 'user-guide-6',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Sub guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
    {
      requestId: 14004,
      eventId: 14,
      userId: 'user-guide-8',
      status: 'APPLIED',
      canceledAt: null,
      group: 'A',
      partner: 'Min Seo',
      detail: 'Beginner support guide',
      competitionInfo: null,
      additionalAnswers: [],
      attended: false,
    },
  ],
  matchings: [
    {
      eventId: 1,
      viId: 'user-vi-1',
      guideIds: ['user-guide-2', 'user-guide-1'],
    },
    {
      eventId: 4,
      viId: 'user-vi-1',
      guideIds: ['user-guide-2', 'user-guide-1'],
    },
    {
      eventId: 5,
      viId: 'user-vi-1',
      guideIds: ['user-guide-2'],
    },
    {
      eventId: 6,
      viId: 'user-vi-1',
      guideIds: ['user-guide-2'],
    },
    {
      eventId: 7,
      viId: 'user-vi-2',
      guideIds: ['user-guide-4'],
    },
    {
      eventId: 7,
      viId: 'user-vi-3',
      guideIds: ['user-guide-5', 'user-guide-3'],
    },
    {
      eventId: 9,
      viId: 'user-vi-1',
      guideIds: ['user-guide-2', 'user-guide-3'],
    },
    {
      eventId: 10,
      viId: 'user-vi-1',
      guideIds: ['user-guide-2', 'user-guide-4'],
    },
    {
      eventId: 11,
      viId: 'user-vi-1',
      guideIds: ['user-guide-1', 'user-guide-5'],
    },
    {
      eventId: 12,
      viId: 'user-vi-1',
      guideIds: ['user-guide-3', 'user-guide-6'],
    },
    {
      eventId: 13,
      viId: 'user-vi-1',
      guideIds: ['user-guide-4', 'user-guide-7'],
    },
    {
      eventId: 14,
      viId: 'user-vi-1',
      guideIds: ['user-guide-2', 'user-guide-6', 'user-guide-8'],
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
  const user = findUser(mockSessionUserId);

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

export const buildAdditionalQuestionDetails = (
  eventId: number,
): AdditionalQuestionDetail[] => {
  return mockDb.additionalQuestions
    .filter((question) => question.eventId === eventId)
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((question) => {
      if (question.type === 'TEXT') {
        return {
          questionId: question.questionId,
          type: 'TEXT',
          question: question.title,
        };
      }

      return {
        questionId: question.questionId,
        type: 'SELECT',
        question: question.title,
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
    recruitStartDate: event.recruitStartDate,
    recruitEndDate: event.recruitEndDate,
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
    additionalQuestions: buildAdditionalQuestionDetails(event.eventId),
    viewer: {
      isApplied: Boolean(appliedForm),
      isOrganizer: event.organizerId === currentUser.userId,
    },
  };
};

const LIST_WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const formatListDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = LIST_WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${year}. ${pad(month)}. ${pad(day)} ${weekday}`;
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
    dateText: formatListDate(event.schedule.date),
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
    organizerId: mockSessionUserId,
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
