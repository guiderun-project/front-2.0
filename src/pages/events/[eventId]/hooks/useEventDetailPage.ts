import { useState, type Key } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { api } from '@/api/services';
import { USER_ROLES } from '@/constants/roles';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys, getEventDetailViewerKey } from '../queryKeys';
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
  const { eventId: eventIdParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isAuthReady, user } = useAuth();
  const { shareLink } = useKakaoShare();
  const [isRestrictedSheetOpen, setIsRestrictedSheetOpen] = useState(false);
  const [isManagementSheetOpen, setIsManagementSheetOpen] = useState(false);
  const eventId = Number(eventIdParam);
  const isValidEventId = Number.isInteger(eventId) && eventId > 0;
  const canAccessProtectedTabs = isApprovedUser(user);
  const isApprovalPending = user?.role === USER_ROLES.WAIT;
  const selectedTab = getEventDetailTabFromSection(searchParams.get('section'));
  const activeTab = canAccessProtectedTabs ? selectedTab : 'detail';
  const viewerKey = getEventDetailViewerKey(user?.userId);

  const eventDetailQuery = useQuery({
    queryKey: eventDetailQueryKeys.detail(eventId, viewerKey),
    queryFn: () => api.event.detailGet({ eventId }),
    enabled: isValidEventId && isAuthReady,
  });

  const event = eventDetailQuery.data ?? null;
  const canManageEvent =
    event !== null &&
    user !== null &&
    (event?.viewer?.isOrganizer === true || user.role === USER_ROLES.ADMIN);

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
      // TODO: 공용 토스트나 스낵바가 준비되면 window.alert 대체
      window.alert(
        isCopied ? '링크를 복사했어요.' : '링크 복사에 실패했어요.',
      );
    });
  };

  const handleKakaoShare = () => {
    if (event === null) {
      return;
    }

    shareLink(event.name, event.organizer.name);
  };

  return {
    activeTab,
    canAccessProtectedTabs,
    canManageEvent,
    closeManagementSheet,
    closeRestrictedSheet,
    event,
    eventDetailQuery,
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
