import type {
  AdditionalQuestionType,
  RunningGroup,
  UserType,
} from './common';

export type EventMatchingStatusPath = {
  eventId: number;
};

export type EventMatchingStatusResponse = {
  myPartners: MatchingStatusUser[];
  groups: MatchingStatusGroup[];
};

export type MatchingStatusGroup = {
  runningGroup: MatchingRunningGroup;
  totalCount: number;
  rows: MatchingStatusRow[];
};

export type MatchingStatusRow = {
  vi: MatchingStatusUser | null;
  guides: MatchingStatusUser[];
};

export type MatchingStatusUser = {
  userId: string;
  name: string;
  type: UserType;
  applyGroup: RunningGroup | null;
  defaultGroup: RunningGroup | null;
};

export type MatchingRunningGroup = RunningGroup | '';

export type MatchingWaitingPath = EventMatchingStatusPath;

export type MatchingWaitingResponse = {
  summary: {
    waitingCount: number;
    viCount: number;
    guideCount: number;
  };
  groups: MatchingWaitingGroup[];
};

export type MatchingWaitingGroup = {
  runningGroup: MatchingRunningGroup;
  totalCount: number;
  participants: MatchingWaitingParticipant[];
};

export type MatchingWaitingParticipant = {
  userId: string;
  name: string;
  type: UserType;
  originalRunningGroup: RunningGroup | null;
  isFirstParticipation: boolean;
  hopePartner: string | null;
  additionalComment: string | null;
  additionalAnswers: MatchingWaitingAdditionalAnswer[] | null;
};

export type MatchingWaitingAdditionalAnswer = {
  questionId: number;
  questionTitle: string;
  questionType: AdditionalQuestionType;
  answer: string | null;
};

export type MatchingCompletedPath = EventMatchingStatusPath;

export type MatchingCompletedResponse = {
  summary: {
    completedViCount: number;
    matchedGuideCount: number;
  };
  groups: MatchingCompletedGroup[];
};

export type MatchingCompletedGroup = {
  runningGroup: MatchingRunningGroup;
  totalCount: number;
  rows: MatchingCompletedRow[];
};

export type MatchingCompletedRow = {
  vi: MatchingStatusUser;
  guides: MatchingStatusUser[];
};

export type MatchingCreatePath = EventMatchingStatusPath;

export type MatchingCreateRequest = {
  viId: string;
  guideIds: string[];
};

export type MatchingCreateInput = MatchingCreatePath & {
  body: MatchingCreateRequest;
};

export type MatchingCreateResponse = {
  viId: string;
  guideIds: string[];
  summary: {
    waitingCount: number;
    completedViCount: number;
    matchedGuideCount: number;
  };
};

export type MatchingCancelPath = EventMatchingStatusPath & {
  viId: string;
};

export type MatchingCancelResponse = {
  viId: string;
  canceledGuideIds: string[];
  summary: MatchingCreateResponse['summary'];
};
