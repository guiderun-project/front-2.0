import { useMemo } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { EventDetailResponse } from '@/api/types';
import { api } from '@/api/services';
import type { ButtonGroupRatio } from '@/components';
import { APP_PATH } from '@/router/path';

import {
  getEventDetailCtaButtonConfigs,
  type EventDetailCtaButtonConfig,
} from '../eventDetailCtaButtonConfigs';
import { eventDetailQueryKeys } from '../queryKeys';

type UseEventDetailCtaParams = {
  canAccessProtectedTabs: boolean;
  canManageEvent: boolean;
  event: EventDetailResponse;
  onRestrictedAccess: () => void;
};

export type EventDetailCtaButton = EventDetailCtaButtonConfig & {
  onClick?: () => void;
};

type UseEventDetailCtaResult = {
  buttons: EventDetailCtaButton[];
  ratio?: ButtonGroupRatio;
};

export const useEventDetailCta = ({
  canAccessProtectedTabs,
  canManageEvent,
  event,
  onRestrictedAccess,
}: UseEventDetailCtaParams): UseEventDetailCtaResult => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const eventId = event.eventId;

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

  const buttonConfigs = useMemo(
    () =>
      getEventDetailCtaButtonConfigs({
        canManageEvent,
        isApplied: event.viewer?.isApplied === true,
        recruitStatus: event.recruitStatus,
      }),
    [canManageEvent, event.recruitStatus, event.viewer?.isApplied],
  );

  const buttons = buttonConfigs.map<EventDetailCtaButton>((button) => {
    switch (button.action) {
      case 'apply':
        return {
          ...button,
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
          ...button,
          onClick: () => {
            navigate(APP_PATH.EVENT_APPLY(eventId));
          },
        };
      case 'cancelApplication':
        return {
          ...button,
          disabled: button.disabled || cancelApplicationMutation.isPending,
          onClick: () => {
            cancelApplicationMutation.mutate();
          },
        };
      case 'match':
        return {
          ...button,
          onClick: () => {
            navigate(APP_PATH.EVENT_MATCH(eventId));
          },
        };
      case 'attendance':
        return {
          ...button,
          onClick: () => {
            navigate(APP_PATH.EVENT_ATTENDANCE(eventId));
          },
        };
      case 'disabled':
        return button;
    }
  });

  return {
    buttons,
    ratio: buttons.length === 2 ? '35:65' : undefined,
  };
};
