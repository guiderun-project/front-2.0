import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/services';

import { useRemoveMissingEvent } from './useRemoveMissingEvent';

export const useSkipRunningDistance = (
  eventId: number,
  onSkipped?: () => void,
) => {
  const removeMissingEvent = useRemoveMissingEvent();

  return useMutation({
    mutationFn: () => api.event.runningDistanceSkipPatch({ eventId }),
    onSuccess: ({ eventId: skippedEventId }) => {
      // 스킵으로 시트가 전환·닫히기 전에 알려, 남은 저장 성공 플래그가
      // 건너뛰기 직후 오도성 안내로 소비되지 않게 한다.
      onSkipped?.();
      removeMissingEvent(skippedEventId);
    },
  });
};
