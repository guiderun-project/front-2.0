import { useState, type Key } from 'react';

import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { useToast } from '@/components';
import { USER_ROLES } from '@/constants/roles';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import { useEventDetailRoute } from '../EventDetailRouteContext';
import type { EventDetailTab } from '../types';
import { copyTextToClipboard, isApprovedUser, isEventDetailTab } from '../utils';
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
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const { event, eventId, isValidEventId } = useEventDetailRoute();
  const { shareLink } = useKakaoShare();
  const [isRestrictedSheetOpen, setIsRestrictedSheetOpen] = useState(false);
  const [isManagementSheetOpen, setIsManagementSheetOpen] = useState(false);
  const canAccessProtectedTabs = isApprovedUser(user);
  const isApprovalPending = user?.role === USER_ROLES.WAIT;
  const selectedTab = getEventDetailTabFromSection(searchParams.get('section'));
  const activeTab = canAccessProtectedTabs ? selectedTab : 'detail';
  const canManageEvent =
    user !== null &&
    (event.viewer?.isOrganizer === true || user.role === USER_ROLES.ADMIN);

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
    navigate(APP_PATH.LOGIN, { state: { from: location } });
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
    canManageEvent,
    closeManagementSheet,
    closeRestrictedSheet,
    event,
    eventId,
    handleBack,
    handleCopyLink,
    handleKakaoShare,
    handleLogin,
    handleTabSelectionChange,
    isApprovalPending,
    isAuthenticated,
    isManagementSheetOpen,
    isRestrictedSheetOpen,
    isValidEventId,
    openManagementSheet,
    openRestrictedSheet,
  };
};
