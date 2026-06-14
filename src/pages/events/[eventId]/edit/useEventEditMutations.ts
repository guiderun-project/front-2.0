import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/services';
import type { EventDetailResponse } from '@/api/types';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys } from '../queryKeys';
import type { EventFormValues } from '../../form/schema';
import { createEventUpdateRequest } from '../../form/utils';

type UseEventEditMutationsParams = {
  event: EventDetailResponse | null;
  eventId: number;
};

export const useEventEditMutations = ({
  event,
  eventId,
}: UseEventEditMutationsParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (values: EventFormValues) => {
      if (!event) {
        throw new Error('Event detail is required.');
      }

      return api.event.updatePatch({
        eventId,
        body: createEventUpdateRequest({
          eventType: event.eventType,
          values,
        }),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.detailRoot(eventId),
      });
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.root,
      });
      navigate(APP_PATH.EVENT_DETAIL(eventId));
    },
    onError: () => {
      window.alert('모임 수정에 실패했어요.');
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => api.event.delete({ eventId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.root,
      });
      navigate(APP_PATH.EVENTS);
    },
    onError: () => {
      window.alert('모집 게시글 삭제에 실패했어요.');
    },
  });

  return {
    deleteEvent: deleteMutation.mutate,
    isDeletingEvent: deleteMutation.isPending,
    isUpdatingEvent: updateMutation.isPending,
    updateEvent: updateMutation.mutate,
  };
};
