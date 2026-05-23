import type {
  AdditionalQuestionType,
  RunningGroup,
  UserType,
} from './common';

export type EventMatchingStatusPath = {
  eventId: number;
};

export type EventMatchingStatusResponse = {
  myPartners: MatchingUser[];
  groups: MatchingGroup[];
};

export type MatchingGroup = {
  runningGroup: RunningGroup;
  totalCount: number;
  rows: MatchingRow[];
};

export type MatchingRow = {
  vi: MatchingUser | null;
  guides: MatchingUser[];
};

export type MatchingUser = {
  userId: string;
  name: string;
  type: UserType;
  applyGroup: RunningGroup;
};

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
  runningGroup: RunningGroup;
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
  additionalAnswers: Array<{
    questionId: number;
    questionTitle: string;
    questionType: AdditionalQuestionType;
    answer: string | null;
  }>;
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
  runningGroup: RunningGroup;
  totalCount: number;
  rows: MatchingCompletedRow[];
};

export type MatchingCompletedRow = {
  vi: MatchingUser;
  guides: MatchingUser[];
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
