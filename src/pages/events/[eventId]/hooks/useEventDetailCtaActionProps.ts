import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/services';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys } from '../queryKeys';
import type { EventDetailCtaButtonConfig } from '../utils/eventDetailCtaButtonConfigs';

type UseEventDetailCtaActionPropsParams = {
  canAccessProtectedTabs: boolean;
  eventId: number;
  onRestrictedAccess: () => void;
};

type EventDetailCtaActionProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export const useEventDetailCtaActionProps = ({
  canAccessProtectedTabs,
  eventId,
  onRestrictedAccess,
}: UseEventDetailCtaActionPropsParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cancelApplicationMutation = useMutation({
    mutationFn: () => api.application.cancelDelete({ eventId }),
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: eventDetailQueryKeys.detailRoot(eventId),
        }),
        queryClient.invalidateQueries({
          queryKey: eventDetailQueryKeys.applicants(eventId),
        }),
        queryClient.invalidateQueries({
          queryKey: eventDetailQueryKeys.matchingStatus(eventId),
        }),
      ]);
    },
    onError: () => {
      window.alert('신청 취소에 실패했어요.');
    },
  });

  const getEventDetailCtaActionProps = (
    button: EventDetailCtaButtonConfig,
  ): EventDetailCtaActionProps => {
    switch (button.action) {
      case 'apply':
        return {
          onClick: () => {
            if (!canAccessProtectedTabs) {
              onRestrictedAccess();
              return;
            }

            navigate(APP_PATH.EVENT_APPLY(eventId));
          },
        };
      case 'editApplication':
        return {
          onClick: () => {
            navigate(APP_PATH.EVENT_APPLY(eventId));
          },
        };
      case 'cancelApplication':
        return {
          disabled: button.disabled || cancelApplicationMutation.isPending,
          onClick: () => {
            cancelApplicationMutation.mutate();
          },
        };
      case 'match':
        return {
          onClick: () => {
            navigate(APP_PATH.EVENT_MATCH(eventId));
          },
        };
      case 'attendance':
        return {
          onClick: () => {
            navigate(APP_PATH.EVENT_ATTENDANCE(eventId));
          },
        };
      case 'disabled':
        return {};
    }
  };

  return { getEventDetailCtaActionProps };
};
