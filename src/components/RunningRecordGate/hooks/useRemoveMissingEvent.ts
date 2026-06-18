import { useQueryClient } from '@tanstack/react-query';

import type { MissingRunningDistanceGetResponse } from '@/api/types';

import { runningRecordQueryKeys } from '../queryKeys';

export const useRemoveMissingEvent = () => {
  const queryClient = useQueryClient();

  return (eventId: number) => {
    queryClient.setQueryData<MissingRunningDistanceGetResponse>(
      runningRecordQueryKeys.missing(),
      (previous) =>
        previous && {
          ...previous,
          items: previous.items.filter((item) => item.eventId !== eventId),
        },
    );
  };
};
