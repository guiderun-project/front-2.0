import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/services';

import { useRemoveMissingEvent } from './useRemoveMissingEvent';

export const useSkipRunningDistance = (eventId: number) => {
  const removeMissingEvent = useRemoveMissingEvent();

  return useMutation({
    mutationFn: () => api.event.runningDistanceSkipPatch({ eventId }),
    onSuccess: ({ eventId: skippedEventId }) => {
      removeMissingEvent(skippedEventId);
    },
  });
};
