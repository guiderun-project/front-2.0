import { useMemo, useRef, useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '@/api/core';
import type {
  MatchingCompletedRow,
  MatchingWaitingParticipant,
  UserType,
} from '@/api/types';
import { api } from '@/api/services';
import { useToast } from '@/components';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import type { MatchReadyState } from './matchPageState';
import { matchQueryKeys } from './queryKeys';
import { useEventDetailRoute } from '../EventDetailRouteContext';
import { eventDetailQueryKeys } from '../queryKeys';
import type { EventGroupLabelContext } from '../utils';
import { canManageEventOperations } from '../utils/eventDetailPermissions';

export type MatchTabId = 'waiting' | 'completed';

type CreateMatchingInput = {
  guideIds: string[];
  viId: string;
};

type CancelMatchingInput = {
  viId: string;
  viName: string;
};

type CancelMatchingOptions = {
  onSuccess?: () => void;
};

type LiveAnnouncement = {
  message: string;
  politeness: 'polite' | 'assertive';
};

const MATCHING_COMPLETE_MESSAGE = '매칭을 완료했어요.';
const EMPTY_ANNOUNCEMENT: LiveAnnouncement = {
  message: '',
  politeness: 'polite',
};

type SelectionAnnouncementInput = {
  participant: MatchingWaitingParticipant;
  selectedGuideIds: string[];
  selectedViId: string | null;
};

const getParticipantType = (
  participant: MatchingWaitingParticipant | undefined,
): UserType | null => {
  return participant?.type ?? null;
};

const getSelectionAnnouncement = ({
  participant,
  selectedGuideIds,
  selectedViId,
}: SelectionAnnouncementInput): string => {
  const isSelected =
    participant.type === 'VI'
      ? selectedViId === participant.userId
      : selectedGuideIds.includes(participant.userId);

  if (!isSelected) {
    return `${participant.name}님의 선택을 취소했습니다.`;
  }

  if (selectedViId === null) {
    return `${participant.name}님을 선택했습니다. 시각장애러너 파트너를 선택해주세요.`;
  }

  if (selectedGuideIds.length === 0) {
    return `${participant.name}님을 선택했습니다. 가이드러너 파트너를 선택해주세요.`;
  }

  return `${participant.name}님을 선택했습니다. 이대로 매칭하기를 눌러주세요.`;
};

export const useEventMatchRoute = () => {
  const navigate = useNavigate();
  const { eventId, isValidEventId } = useEventDetailRoute();
  const validEventId = isValidEventId ? eventId : null;

  const navigateBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(
      validEventId === null ? APP_PATH.EVENTS : APP_PATH.EVENT_DETAIL(validEventId),
    );
  };

  return {
    eventId: validEventId,
    navigateBack,
  };
};

export const useEventMatchPermission = () => {
  const { user } = useAuth();
  const { event } = useEventDetailRoute();
  const eventGroupLabelContext: EventGroupLabelContext = {
    eventCategory: event.eventCategory,
    eventType: event.eventType,
  };

  return {
    canManageMatching: canManageEventOperations({ event, user }),
    eventGroupLabelContext,
  };
};

export const useEventMatchPage = (eventId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<MatchTabId>('waiting');
  const [announcement, setAnnouncement] =
    useState<LiveAnnouncement>(EMPTY_ANNOUNCEMENT);
  const [selectedViId, setSelectedViId] = useState<string | null>(null);
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);
  const [cancelingViId, setCancelingViId] = useState<string | null>(null);
  const isCreatingMatchingGuardRef = useRef(false);

  const [waitingQuery, completedQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: matchQueryKeys.waiting(eventId),
        queryFn: () => api.matching.waitingGet({ eventId }),
      },
      {
        queryKey: matchQueryKeys.completed(eventId),
        queryFn: () => api.matching.completedGet({ eventId }),
      },
    ],
  });

  const pageState: MatchReadyState = {
    completed: completedQuery.data,
    waiting: waitingQuery.data,
  };

  const participantMap = useMemo(() => {
    return new Map(
      waitingQuery.data.groups.flatMap((group) =>
        group.participants.map((participant) => [
          participant.userId,
          participant,
        ] as const),
      ),
    );
  }, [waitingQuery.data]);

  const selectedVi = useMemo(() => {
    if (!selectedViId) {
      return null;
    }

    const participant = participantMap.get(selectedViId);

    return getParticipantType(participant) === 'VI' ? participant ?? null : null;
  }, [participantMap, selectedViId]);

  const selectedGuides = useMemo(() => {
    return selectedGuideIds
      .map((guideId) => participantMap.get(guideId))
      .filter(
        (participant): participant is MatchingWaitingParticipant =>
          getParticipantType(participant) === 'GUIDE',
      );
  }, [participantMap, selectedGuideIds]);

  const selectedUserIds = useMemo(() => {
    return new Set([
      ...(selectedViId ? [selectedViId] : []),
      ...selectedGuideIds,
    ]);
  }, [selectedGuideIds, selectedViId]);

  const hasSelection = selectedVi !== null || selectedGuides.length > 0;
  const hasVisibleSelectionBar = activeTab === 'waiting' && hasSelection;
  const canCreateMatching = selectedVi !== null && selectedGuides.length > 0;

  const announcePolitely = (message: string) => {
    setAnnouncement({ message, politeness: 'polite' });
  };

  const announceAssertively = (message: string) => {
    setAnnouncement({ message, politeness: 'assertive' });
  };

  const clearSelection = () => {
    setSelectedViId(null);
    setSelectedGuideIds([]);
    announcePolitely('선택한 참가자를 모두 해제했습니다.');
  };

  const invalidateMatchingQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: matchQueryKeys.root }),
      queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.matchingStatus(eventId),
      }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: ({ guideIds, viId }: CreateMatchingInput) =>
      api.matching.createPost({
        body: {
          guideIds,
          viId,
        },
        eventId,
      }),
    onSuccess: async () => {
      clearSelection();
      announceAssertively(MATCHING_COMPLETE_MESSAGE);
      showToast({
        type: 'success',
        icon: 'check-thick-lined',
        content: MATCHING_COMPLETE_MESSAGE,
        announce: false,
      });
      await invalidateMatchingQueries();
    },
    onError: (error) => {
      announceAssertively(getApiErrorMessage(error, '매칭에 실패했어요.'));
    },
    onSettled: () => {
      isCreatingMatchingGuardRef.current = false;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ viId }: CancelMatchingInput) =>
      api.matching.cancelDelete({ eventId, viId }),
    onMutate: ({ viId }) => {
      setCancelingViId(viId);
    },
    onError: (error, matching) => {
      announceAssertively(
        getApiErrorMessage(error, `${matching.viName}님의 매칭 취소에 실패했어요.`),
      );
    },
    onSettled: () => {
      setCancelingViId(null);
    },
  });

  const toggleParticipant = (participant: MatchingWaitingParticipant) => {
    if (participant.type === 'VI') {
      const nextSelectedViId =
        selectedViId === participant.userId ? null : participant.userId;

      setSelectedViId(nextSelectedViId);
      announcePolitely(
        getSelectionAnnouncement({
          participant,
          selectedGuideIds,
          selectedViId: nextSelectedViId,
        }),
      );
      return;
    }

    const nextSelectedGuideIds = selectedGuideIds.includes(participant.userId)
      ? selectedGuideIds.filter((guideId) => guideId !== participant.userId)
      : [...selectedGuideIds, participant.userId];

    setSelectedGuideIds(nextSelectedGuideIds);
    announcePolitely(
      getSelectionAnnouncement({
        participant,
        selectedGuideIds: nextSelectedGuideIds,
        selectedViId,
      }),
    );
  };

  const createMatching = () => {
    if (!canCreateMatching || !selectedVi || isCreatingMatchingGuardRef.current) {
      return;
    }

    isCreatingMatchingGuardRef.current = true;
    createMutation.mutate({
      guideIds: selectedGuides.map((guide) => guide.userId),
      viId: selectedVi.userId,
    });
  };

  const cancelMatching = (
    row: MatchingCompletedRow,
    options?: CancelMatchingOptions,
  ) => {
    if (cancelMutation.isPending) {
      return;
    }

    cancelMutation.mutate(
      { viId: row.vi.userId, viName: row.vi.name },
      {
        onSuccess: (_, matching) => {
          const successMessage = `${matching.viName}님의 매칭을 취소했어요.`;

          options?.onSuccess?.();
          announceAssertively(successMessage);
          showToast({
            type: 'error',
            icon: 'delete-lined',
            content: successMessage,
            announce: false,
          });
          void invalidateMatchingQueries();
        },
      },
    );
  };

  return {
    activeTab,
    announcement,
    canCreateMatching,
    cancelMatching,
    cancelingViId,
    clearSelection,
    createMatching,
    hasSelection,
    hasVisibleSelectionBar,
    isCancelingMatching: cancelMutation.isPending,
    isCreatingMatching: createMutation.isPending,
    pageState,
    selectedGuides,
    selectedUserIds,
    selectedVi,
    setActiveTab,
    toggleParticipant,
  };
};

export type EventMatchPageModel = ReturnType<typeof useEventMatchPage>;
