import { useState, type Key } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys, getEventDetailViewerKey } from './queryKeys';
import type { EventDetailTab } from './types';
import { isApprovedUser, isEventDetailTab } from './utils';

const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the textarea fallback for browsers that block Clipboard API.
    }
  }

  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};

export const useEventDetailPage = () => {
  const { eventId: eventIdParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAuthReady, user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<EventDetailTab>('detail');
  const [isRestrictedSheetOpen, setIsRestrictedSheetOpen] = useState(false);
  const [isManagementSheetOpen, setIsManagementSheetOpen] = useState(false);
  const eventId = Number(eventIdParam);
  const isValidEventId = Number.isInteger(eventId) && eventId > 0;
  const canAccessProtectedTabs = isApprovedUser(user);
  const activeTab = canAccessProtectedTabs ? selectedTab : 'detail';
  const viewerKey = getEventDetailViewerKey(user?.userId);

  const eventDetailQuery = useQuery({
    queryKey: eventDetailQueryKeys.detail(eventId, viewerKey),
    queryFn: () => api.event.detailGet({ eventId }),
    enabled: isValidEventId && isAuthReady,
  });
  const applicantsQuery = useQuery({
    queryKey: eventDetailQueryKeys.applicants(eventId),
    queryFn: () => api.application.applicantsGet({ eventId }),
    enabled:
      isValidEventId &&
      canAccessProtectedTabs &&
      activeTab === 'applicants',
  });
  const matchingQuery = useQuery({
    queryKey: eventDetailQueryKeys.matchingStatus(eventId),
    queryFn: () => api.matching.statusGet({ eventId }),
    enabled:
      isValidEventId && canAccessProtectedTabs && activeTab === 'matching',
  });

  const event = eventDetailQuery.data ?? null;
  const canManageEvent =
    event !== null &&
    user !== null &&
    (event?.viewer?.isOrganizer === true || user.role === 'ROLE_ADMIN');

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

    setSelectedTab(key);
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
    // TODO: 카카오톡 공유하기 로직 구현 필요
  };

  return {
    activeTab,
    applicantsQuery,
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
    isAuthenticated,
    isManagementSheetOpen,
    isRestrictedSheetOpen,
    isValidEventId,
    matchingQuery,
    openManagementSheet,
    openRestrictedSheet,
  };
};
