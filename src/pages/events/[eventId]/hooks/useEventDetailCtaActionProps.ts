import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '@/api/core';
import { api } from '@/api/services';
import { useToast } from '@/components';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys } from '../queryKeys';
import type { EventDetailCtaButtonConfig } from '../utils/eventDetailCtaButtonConfigs';

type UseEventDetailCtaActionPropsParams = {
  canAccessProtectedTabs: boolean;
  eventId: number;
  isApplyPermissionChecking?: boolean;
  onApply?: () => void;
  onRestrictedAccess: () => void;
};

type EventDetailCtaActionProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export type EventDetailCancelApplicationConfirm = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const useEventDetailCtaActionProps = ({
  canAccessProtectedTabs,
  eventId,
  isApplyPermissionChecking = false,
  onApply,
  onRestrictedAccess,
}: UseEventDetailCtaActionPropsParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isCancelApplicationConfirmOpen, setIsCancelApplicationConfirmOpen] =
    useState(false);

  const cancelApplicationMutation = useMutation({
    mutationFn: () => api.application.cancelDelete({ eventId }),
    onSuccess: () => {
      setIsCancelApplicationConfirmOpen(false);
      showToast({
        type: 'success',
        icon: 'check-lined',
        content: '신청 취소되었어요.',
      });
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
    onError: (error) => {
      window.alert(getApiErrorMessage(error, '신청 취소에 실패했어요.'));
    },
  });

  const getEventDetailCtaActionProps = (
    button: EventDetailCtaButtonConfig,
  ): EventDetailCtaActionProps => {
    switch (button.action) {
      case 'apply':
        return {
          disabled: isApplyPermissionChecking,
          onClick: () => {
            if (!canAccessProtectedTabs) {
              onRestrictedAccess();
              return;
            }

            if (onApply) {
              onApply();
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
            setIsCancelApplicationConfirmOpen(true);
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

  const cancelApplicationConfirm: EventDetailCancelApplicationConfirm = {
    isOpen: isCancelApplicationConfirmOpen,
    onCancel: () => {
      if (cancelApplicationMutation.isPending) {
        return;
      }

      setIsCancelApplicationConfirmOpen(false);
    },
    onConfirm: () => {
      cancelApplicationMutation.mutate();
    },
  };

  return {
    cancelApplicationConfirm,
    getEventDetailCtaActionProps,
    isCancelApplicationPending: cancelApplicationMutation.isPending,
  };
};
