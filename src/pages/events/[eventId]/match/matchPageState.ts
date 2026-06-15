import type {
  MatchingCompletedResponse,
  MatchingWaitingResponse,
} from '@/api/types';

export type MatchMessageState = {
  message: string;
  role: 'alert' | 'status';
};

export type MatchReadyState = {
  completed: MatchingCompletedResponse;
  waiting: MatchingWaitingResponse;
};
