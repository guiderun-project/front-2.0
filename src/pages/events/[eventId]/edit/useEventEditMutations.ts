import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '@/api/core';
import { api } from '@/api/services';
import type { EventDetailResponse } from '@/api/types';
import { useToast } from '@/components';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys } from '../queryKeys';
import type { EventFormValues } from '../../form/schema';
import { createEventUpdateRequest } from '../../form/utils';

type UseEventEditMutationsParams = {
  event: EventDetailResponse;
  eventId: number;
};

export const useEventEditMutations = ({
  event,
  eventId,
}: UseEventEditMutationsParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const updateMutation = useMutation({
    mutationFn: (values: EventFormValues) => {
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
      navigate(APP_PATH.EVENT_DETAIL(eventId), { replace: true });
      window.setTimeout(() => {
        showToast({
          type: 'success',
          icon: 'check-lined',
          content: '모임 수정이 완료됐어요.',
        });
      }, 0);
    },
    onError: (error) => {
      window.alert(getApiErrorMessage(error, '모임 수정에 실패했어요.'));
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => api.event.delete({ eventId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.root,
      });
      // 삭제 확인 팝업이 페이지와 함께 사라지면 포커스가 body 로 떨어지고
      // 아무 낭독도 없으므로, 앱 셸의 라우트 어나운서(App.tsx RouteAnnouncer)가
      // 삭제 성공 사실을 페이지 제목 대신 낭독하도록 srAnnouncement 를 전달한다.
      navigate(APP_PATH.EVENTS, {
        state: {
          srAnnouncement: '모임 게시글을 삭제했어요. 모임 목록으로 이동했어요.',
        },
      });
    },
    onError: (error) => {
      window.alert(getApiErrorMessage(error, '모집 게시글 삭제에 실패했어요.'));
    },
  });

  return {
    deleteEvent: deleteMutation.mutate,
    isDeletingEvent: deleteMutation.isPending,
    isUpdatingEvent: updateMutation.isPending,
    updateEvent: updateMutation.mutate,
  };
};
