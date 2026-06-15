import { useMemo, useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import type {
  MatchingCompletedRow,
  MatchingWaitingParticipant,
  UserType,
} from '@/api/types';
import { api } from '@/api/services';
import { USER_ROLES } from '@/constants/roles';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import type { MatchReadyState } from './matchPageState';
import { matchQueryKeys } from './queryKeys';
import { eventDetailQueryKeys, getEventDetailViewerKey } from '../queryKeys';

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

const getValidEventId = (eventIdParam: string | undefined): number | null => {
  const eventId = Number(eventIdParam);

  return Number.isInteger(eventId) && eventId > 0 ? eventId : null;
};

const getParticipantType = (
  participant: MatchingWaitingParticipant | undefined,
): UserType | null => {
  return participant?.type ?? null;
};

export const useEventMatchRoute = () => {
  const { eventId: eventIdParam } = useParams();
  const navigate = useNavigate();
  const eventId = getValidEventId(eventIdParam);

  const navigateBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(eventId === null ? APP_PATH.EVENTS : APP_PATH.EVENT_DETAIL(eventId));
  };

  return {
    eventId,
    navigateBack,
  };
};

export const useEventMatchPermission = (eventId: number) => {
  const { user } = useAuth();
  const viewerKey = getEventDetailViewerKey(user?.userId);
  const { data: event } = useSuspenseQuery({
    queryKey: eventDetailQueryKeys.detail(eventId, viewerKey),
    queryFn: () => api.event.detailGet({ eventId }),
  });

  return {
    canManageMatching:
      user !== null &&
      (event.viewer?.isOrganizer === true || user.role === USER_ROLES.ADMIN),
  };
};

export const useEventMatchPage = (eventId: number) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<MatchTabId>('waiting');
  const [announcement, setAnnouncement] = useState('');
  const [selectedViId, setSelectedViId] = useState<string | null>(null);
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);
  const [cancelingViId, setCancelingViId] = useState<string | null>(null);

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

  const clearSelection = () => {
    setSelectedViId(null);
    setSelectedGuideIds([]);
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
      setAnnouncement('매칭을 완료했어요.');
      await invalidateMatchingQueries();
    },
    onError: () => {
      setAnnouncement('매칭에 실패했어요.');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ viId }: CancelMatchingInput) =>
      api.matching.cancelDelete({ eventId, viId }),
    onMutate: ({ viId }) => {
      setCancelingViId(viId);
    },
    onSuccess: async (_, matching) => {
      setAnnouncement(`${matching.viName}님의 매칭을 취소했어요.`);
      await invalidateMatchingQueries();
    },
    onError: (_, matching) => {
      setAnnouncement(`${matching.viName}님의 매칭 취소에 실패했어요.`);
    },
    onSettled: () => {
      setCancelingViId(null);
    },
  });

  const toggleParticipant = (participant: MatchingWaitingParticipant) => {
    if (createMutation.isPending) {
      return;
    }

    if (participant.type === 'VI') {
      setSelectedViId((currentViId) =>
        currentViId === participant.userId ? null : participant.userId,
      );
      return;
    }

    setSelectedGuideIds((currentGuideIds) =>
      currentGuideIds.includes(participant.userId)
        ? currentGuideIds.filter((guideId) => guideId !== participant.userId)
        : [...currentGuideIds, participant.userId],
    );
  };

  const createMatching = () => {
    if (!canCreateMatching || !selectedVi || createMutation.isPending) {
      return;
    }

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
      options,
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
