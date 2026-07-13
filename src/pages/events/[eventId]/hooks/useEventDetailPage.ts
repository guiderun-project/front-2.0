import { useState, type Key } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { getApiErrorMessage } from '@/api/core';
import { userQueryKeys } from '@/api/queryKeys';
import { api } from '@/api/services';
import type { UserPermissionGetResponse } from '@/api/types';
import { useToast } from '@/components';
import { USER_ROLES } from '@/constants/roles';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import { useEventDetailRoute } from '../EventDetailRouteContext';
import type { EventDetailTab } from '../types';
import { copyTextToClipboard, isApprovedUser, isEventDetailTab } from '../utils';
import {
  canManageEventOperations,
  canManageEventPost,
  isEventOrganizer,
} from '../utils/eventDetailPermissions';
import { useKakaoShare } from './useKakaoShare';

const EVENT_DETAIL_SECTION_TO_TAB: Record<string, EventDetailTab> = {
  applicants: 'applicants',
  detail: 'detail',
  matching: 'matching',
};

const getEventDetailTabFromSection = (
  section: string | null,
): EventDetailTab => {
  if (section === null) {
    return 'detail';
  }

  return EVENT_DETAIL_SECTION_TO_TAB[section] ?? 'detail';
};

export const useEventDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const { event, eventId, isValidEventId } = useEventDetailRoute();
  const { shareLink } = useKakaoShare();
  const [isRestrictedSheetOpen, setIsRestrictedSheetOpen] = useState(false);
  const [isManagementSheetOpen, setIsManagementSheetOpen] = useState(false);
  const [isTrainingSafetySheetOpen, setIsTrainingSafetySheetOpen] =
    useState(false);
  const canAccessProtectedTabs = isApprovedUser(user);
  const userPermissionQueryKey = user
    ? userQueryKeys.permission(user.userId)
    : userQueryKeys.root;
  const isApprovalPending = user?.role === USER_ROLES.WAIT;
  const selectedTab = getEventDetailTabFromSection(searchParams.get('section'));
  const activeTab = canAccessProtectedTabs ? selectedTab : 'detail';
  const isOrganizer = isEventOrganizer(event);
  const canManageEventActions = canManageEventOperations({ event, user });
  const canManagePost = canManageEventPost({ event, user });
  const canExtractAttendanceList = user?.role === USER_ROLES.ADMIN;
  const canShowOperationActionsInMenu =
    canManageEventActions &&
    !isOrganizer &&
    event.recruitStatus !== 'RECRUIT_UPCOMING';
  const canOpenManagementSheet =
    canManagePost || canExtractAttendanceList || canShowOperationActionsInMenu;

  const openRestrictedSheet = () => {
    setIsRestrictedSheetOpen(true);
  };

  const closeRestrictedSheet = () => {
    setIsRestrictedSheetOpen(false);
  };

  const openManagementSheet = () => {
    setIsManagementSheetOpen(true);
  };

  const closeManagementSheet = () => {
    setIsManagementSheetOpen(false);
  };

  const checkTrainingSafetyPermissionMutation = useMutation({
    mutationFn: () =>
      queryClient.fetchQuery({
        queryKey: userPermissionQueryKey,
        queryFn: () => api.user.permissionGet(),
        staleTime: Infinity,
      }),
    onSuccess: (permission) => {
      if (permission.trainingSafety) {
        navigate(APP_PATH.EVENT_APPLY(eventId));
        return;
      }

      setIsTrainingSafetySheetOpen(true);
    },
    onError: (error) => {
      window.alert(
        getApiErrorMessage(error, '권한 정보를 불러오지 못했어요.'),
      );
    },
  });

  const trainingSafetyPermissionMutation = useMutation({
    mutationFn: () =>
      api.user.trainingSafetyPermissionPatch({ trainingSafety: true }),
    onSuccess: () => {
      queryClient.setQueryData<UserPermissionGetResponse>(
        userPermissionQueryKey,
        { trainingSafety: true },
      );
      setIsTrainingSafetySheetOpen(false);
      navigate(APP_PATH.EVENT_APPLY(eventId));
    },
    onError: (error) => {
      window.alert(
        getApiErrorMessage(
          error,
          '훈련 참여 및 안전 면책 동의를 저장하지 못했어요.',
        ),
      );
    },
  });

  const handleApply = () => {
    if (!canAccessProtectedTabs) {
      openRestrictedSheet();
      return;
    }

    const cachedPermission =
      queryClient.getQueryData<UserPermissionGetResponse>(userPermissionQueryKey);

    if (cachedPermission?.trainingSafety) {
      navigate(APP_PATH.EVENT_APPLY(eventId));
      return;
    }

    if (cachedPermission?.trainingSafety === false) {
      setIsTrainingSafetySheetOpen(true);
      return;
    }

    if (
      checkTrainingSafetyPermissionMutation.isPending ||
      trainingSafetyPermissionMutation.isPending
    ) {
      return;
    }

    checkTrainingSafetyPermissionMutation.mutate();
  };

  const closeTrainingSafetySheet = () => {
    if (!trainingSafetyPermissionMutation.isPending) {
      setIsTrainingSafetySheetOpen(false);
    }
  };

  const handleTrainingSafetyAgreement = () => {
    if (trainingSafetyPermissionMutation.isPending) {
      return;
    }

    trainingSafetyPermissionMutation.mutate();
  };

  const handleTabSelectionChange = (key: Key) => {
    if (!isEventDetailTab(key)) {
      return;
    }

    if (key !== 'detail' && !canAccessProtectedTabs) {
      openRestrictedSheet();
      return;
    }

    setSearchParams(
      (prevSearchParams) => {
        const nextSearchParams = new URLSearchParams(prevSearchParams);

        if (key === 'detail') {
          nextSearchParams.delete('section');
        } else {
          nextSearchParams.set('section', key);
        }

        return nextSearchParams;
      },
      { replace: true },
    );
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(APP_PATH.EVENTS);
  };

  const handleLogin = () => {
    navigate(APP_PATH.INTRO, { state: { from: location } });
  };

  const handleCopyLink = () => {
    void copyTextToClipboard(window.location.href).then((isCopied) => {
      showToast({
        type: isCopied ? 'success' : 'error',
        icon: isCopied ? 'check-lined' : 'alert-circle-filled',
        content: isCopied ? '링크를 복사했어요.' : '링크 복사에 실패했어요.',
      });
    });
  };

  const handleKakaoShare = () => {
    shareLink(event.name, event.organizer.name);
  };

  return {
    activeTab,
    canAccessProtectedTabs,
    canExtractAttendanceList,
    canManageEventActions,
    canManagePost,
    canOpenManagementSheet,
    closeManagementSheet,
    closeRestrictedSheet,
    closeTrainingSafetySheet,
    event,
    eventId,
    handleApply,
    handleBack,
    handleCopyLink,
    handleKakaoShare,
    handleLogin,
    handleTabSelectionChange,
    handleTrainingSafetyAgreement,
    isApprovalPending,
    isApplyPermissionChecking: checkTrainingSafetyPermissionMutation.isPending,
    isAuthenticated,
    isOrganizer,
    isManagementSheetOpen,
    isRestrictedSheetOpen,
    isTrainingSafetyAgreementPending:
      trainingSafetyPermissionMutation.isPending,
    isTrainingSafetySheetOpen,
    isValidEventId,
    openManagementSheet,
    openRestrictedSheet,
    shouldShowOperationActionsInMenu: canShowOperationActionsInMenu,
  };
};
