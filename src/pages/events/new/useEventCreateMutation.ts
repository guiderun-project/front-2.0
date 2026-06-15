import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/services';
import type { EventType } from '@/api/types';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys } from '../[eventId]/queryKeys';
import type { EventFormValues } from '../form/schema';
import { createEventCreateRequest } from '../form/utils';

type UseEventCreateMutationParams = {
  eventType: EventType | null;
};

export const useEventCreateMutation = ({
  eventType,
}: UseEventCreateMutationParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: EventFormValues) => {
      if (!eventType) {
        throw new Error('Event type is required.');
      }

      return api.event.createPost(
        createEventCreateRequest({ eventType, values }),
      );
    },
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.root,
      });
      navigate(APP_PATH.EVENT_DETAIL(response.eventId));
    },
    onError: () => {
      window.alert('모임 만들기에 실패했어요.');
    },
  });

  return {
    createEvent: createMutation.mutate,
    isCreatingEvent: createMutation.isPending,
  };
};
