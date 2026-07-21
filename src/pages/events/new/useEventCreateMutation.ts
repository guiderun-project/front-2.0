import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '@/api/core';
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
      // SPA 라우트 전환은 스크린리더에 자동으로 안내되지 않으므로, 앱 셸의
      // 라우트 어나운서(App.tsx RouteAnnouncer)가 생성 성공 사실을 페이지
      // 제목 대신 낭독하도록 srAnnouncement 를 함께 전달한다.
      navigate(APP_PATH.EVENT_DETAIL(response.eventId), {
        replace: true,
        state: { srAnnouncement: '모임을 만들었어요. 모임 상세 페이지로 이동했어요.' },
      });
    },
    onError: (error) => {
      window.alert(getApiErrorMessage(error, '모임 만들기에 실패했어요.'));
    },
  });

  return {
    createEvent: createMutation.mutate,
    isCreatingEvent: createMutation.isPending,
  };
};
