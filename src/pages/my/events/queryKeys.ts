import type {
  EventListTypeFilter,
  MyActivityEventRelationFilter,
} from '@/api/types';

export type MyActivityEventsParams = {
  type: EventListTypeFilter;
  relation: MyActivityEventRelationFilter;
  page: number;
};

export const myActivityQueryKeys = {
  root: ['my-activity'] as const,
  events: (params: MyActivityEventsParams) =>
    [...myActivityQueryKeys.root, 'events', params] as const,
};
