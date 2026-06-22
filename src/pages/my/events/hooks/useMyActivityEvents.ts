import { useSuspenseQuery } from '@tanstack/react-query';

import { api } from '@/api/services';

import { myActivityQueryKeys, type MyActivityEventsParams } from '../queryKeys';

export const useMyActivityEvents = (params: MyActivityEventsParams) =>
  useSuspenseQuery({
    queryKey: myActivityQueryKeys.events(params),
    queryFn: () => api.user.activityEventsGet(params),
  });
