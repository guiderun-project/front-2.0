import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/services';

import { useRemoveMissingEvent } from './useRemoveMissingEvent';

export const useSaveRunningDistance = (eventId: number) => {
  const queryClient = useQueryClient();
  const removeMissingEvent = useRemoveMissingEvent();

  return useMutation({
    mutationFn: (expectedRunningDistanceKm: number) =>
      api.event.runningDistancePatch({
        eventId,
        body: { expectedRunningDistanceKm },
      }),
    onSuccess: ({ eventId: savedEventId }) => {
      removeMissingEvent(savedEventId);
      void queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
};
