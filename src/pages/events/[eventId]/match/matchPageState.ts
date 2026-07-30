import type {
  MatchingCompletedResponse,
  MatchingWaitingResponse,
} from '@/api/types';

export type MatchMessageState = {
  message: string;
  role: 'alert' | 'status';
};

export type MatchSectionId = 'waiting' | 'completed';

export type MatchReadyState = {
  completed: MatchingCompletedResponse;
  waiting: MatchingWaitingResponse;
};
