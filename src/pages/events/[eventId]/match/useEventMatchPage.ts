import { useMemo, useRef, useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '@/api/core';
import type { UserType } from '@/api/types';
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

/**
 * 매칭하기 화면에서 선택 대상이 될 수 있는 인물의 최소 정보.
 * 매칭대기 참가자와 매칭완료 쌍(VI/가이드) 모두 이 형태로 통합해 다룬다.
 */
export type SelectablePerson = {
  userId: string;
  name: string;
  type: UserType;
};

type CreateMatchingInput = {
  guideIds: string[];
  viId: string;
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
  person: SelectablePerson;
  selectedGuideIds: string[];
  selectedViId: string | null;
};

const getSelectionAnnouncement = ({
  person,
  selectedGuideIds,
  selectedViId,
}: SelectionAnnouncementInput): string => {
  const isSelected =
    person.type === 'VI'
      ? selectedViId === person.userId
      : selectedGuideIds.includes(person.userId);

  if (!isSelected) {
    return `${person.name}님의 선택을 취소했습니다.`;
  }

  if (selectedViId === null) {
    return `${person.name}님을 선택했습니다. 시각장애러너 파트너를 선택해주세요.`;
  }

  if (selectedGuideIds.length === 0) {
    return `${person.name}님을 선택했습니다. 가이드러너 파트너를 선택해주세요.`;
  }

  return `${person.name}님을 선택했습니다. 이대로 매칭하기를 눌러주세요.`;
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
  const [announcement, setAnnouncement] =
    useState<LiveAnnouncement>(EMPTY_ANNOUNCEMENT);
  const [selectedViId, setSelectedViId] = useState<string | null>(null);
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);
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

  // 매칭대기 참가자 + 매칭완료 쌍의 VI/가이드를 하나의 선택 후보 맵으로 통합한다.
  const personMap = useMemo(() => {
    const map = new Map<string, SelectablePerson>();

    waitingQuery.data.groups.forEach((group) => {
      group.participants.forEach((participant) => {
        map.set(participant.userId, {
          userId: participant.userId,
          name: participant.name,
          type: participant.type,
        });
      });
    });

    completedQuery.data.groups.forEach((group) => {
      group.rows.forEach((row) => {
        map.set(row.vi.userId, {
          userId: row.vi.userId,
          name: row.vi.name,
          type: row.vi.type,
        });
        row.guides.forEach((guide) => {
          map.set(guide.userId, {
            userId: guide.userId,
            name: guide.name,
            type: guide.type,
          });
        });
      });
    });

    return map;
  }, [completedQuery.data, waitingQuery.data]);

  const selectedVi = useMemo(() => {
    if (!selectedViId) {
      return null;
    }

    const person = personMap.get(selectedViId);

    return person?.type === 'VI' ? person : null;
  }, [personMap, selectedViId]);

  const selectedGuides = useMemo(() => {
    return selectedGuideIds
      .map((guideId) => personMap.get(guideId))
      .filter(
        (person): person is SelectablePerson => person?.type === 'GUIDE',
      );
  }, [personMap, selectedGuideIds]);

  const selectedUserIds = useMemo(() => {
    return new Set([
      ...(selectedViId ? [selectedViId] : []),
      ...selectedGuideIds,
    ]);
  }, [selectedGuideIds, selectedViId]);

  const hasSelection = selectedVi !== null || selectedGuides.length > 0;
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

  const toggleParticipant = (person: SelectablePerson) => {
    if (person.type === 'VI') {
      // 체크박스는 각각 독립적으로 동작한다. VI 선택은 VI만 토글한다.
      const nextSelectedViId =
        selectedViId === person.userId ? null : person.userId;

      setSelectedViId(nextSelectedViId);
      announcePolitely(
        getSelectionAnnouncement({
          person,
          selectedGuideIds,
          selectedViId: nextSelectedViId,
        }),
      );
      return;
    }

    const nextSelectedGuideIds = selectedGuideIds.includes(person.userId)
      ? selectedGuideIds.filter((guideId) => guideId !== person.userId)
      : [...selectedGuideIds, person.userId];

    setSelectedGuideIds(nextSelectedGuideIds);
    announcePolitely(
      getSelectionAnnouncement({
        person,
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

  return {
    announcement,
    canCreateMatching,
    clearSelection,
    createMatching,
    hasSelection,
    isCreatingMatching: createMutation.isPending,
    pageState,
    selectedGuides,
    selectedUserIds,
    selectedVi,
    toggleParticipant,
  };
};

export type EventMatchPageModel = ReturnType<typeof useEventMatchPage>;
