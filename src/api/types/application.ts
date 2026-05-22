import type {
  AdditionalQuestionType,
  EventCategory,
  EventType,
  RunningGroup,
  UserType,
} from './common';

export type EventApplyPath = {
  eventId: number;
};

export type CompetitionApplicationInfo = {
  birthDate: string;
  phoneNumber: string;
};

export type AdditionalAnswer =
  | { questionId: number; type: 'TEXT'; answerText: string }
  | { questionId: number; type: 'SELECT'; selectedOptionId: number };

export type EventApplyPostRequestBody = {
  group: RunningGroup;
  partner?: string;
  detail?: string;
  competitionInfo?: CompetitionApplicationInfo;
  additionalAnswers?: AdditionalAnswer[];
};

export type EventApplyPostRequest = EventApplyPath & {
  body: EventApplyPostRequestBody;
};

export type EventApplyPostResponse = {
  requestId: number;
};

export type EventApplyPatchRequestBody = EventApplyPostRequestBody;

export type EventApplyPatchRequest = EventApplyPath & {
  body: EventApplyPatchRequestBody;
};

export type EventApplyPatchResponse = EventApplyPostResponse;
export type MyEventApplyPath = EventApplyPath;

export type MyEventApplyGetResponse = {
  eventId: number;
  eventName: string;
  eventType: EventType;
  eventCategory: EventCategory;
  userType: UserType;
  name: string;
  recordDegree: RunningGroup;
  applicationInfo: {
    group: RunningGroup;
    partner: string | null;
    detail: string | null;
  };
  competitionInfo: CompetitionApplicationInfo | null;
  additionalAnswers: AdditionalAnswerDetail[];
};

export type AdditionalAnswerDetail =
  | {
      questionId: number;
      type: 'TEXT';
      question: string;
      answerText: string | null;
    }
  | {
      questionId: number;
      type: 'SELECT';
      question: string;
      selectedOptionId: number | null;
      selectedOptionValue: string | null;
      options: Array<{ optionId: number; value: string }>;
    };

export type EventApplyCancelPath = EventApplyPath;
export type EventApplicantListPath = EventApplyPath;

export type EventApplicantListResponse = {
  summary: {
    totalCount: number;
    viCount: number;
    guideCount: number;
  };
  groups: EventApplicantGroup[];
};

export type EventApplicantGroup = {
  runningGroup: RunningGroup;
  totalCount: number;
  applicants: EventApplicant[];
};

export type EventApplicant = {
  userId: string;
  name: string;
  type: UserType;
  isFirstParticipation: boolean;
};

export type EventApplicantFormPath = EventApplyPath & {
  userId: string;
};

export type EventApplicantFormResponse = {
  applicant: {
    userId: string;
    name: string;
    type: UserType;
    birthDate: string | null;
    phoneNumber: string | null;
  };
  form: {
    applyGroup: RunningGroup;
    hopePartner: string | null;
    additionalComment: string | null;
  };
  additionalAnswers: Array<{
    questionId: number;
    questionTitle: string;
    questionType: AdditionalQuestionType;
    answer: string | null;
  }>;
};

export type EventCanceledApplicantListPath = EventApplyPath;

export type EventCanceledApplicantListResponse = {
  summary: {
    totalCount: number;
    viCount: number;
    guideCount: number;
  };
  canceledApplicants: CanceledApplicant[];
};

export type CanceledApplicant = {
  userId: string;
  name: string;
  type: UserType;
  canceledAt: string | null;
};
