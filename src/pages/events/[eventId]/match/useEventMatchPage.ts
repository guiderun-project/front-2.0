import { useCallback, useMemo, useRef, useState } from 'react';

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
  // 시각장애러너를 다른 사람으로 교체한 경우 기존 선택자의 이름.
  replacedViName?: string | null;
};

const getMatchingCompleteAnnouncement = (
  viName: string | undefined,
  waitingCount: number,
): string => {
  const completeMessage = viName
    ? `${viName}님과 가이드러너 매칭을 완료했어요.`
    : MATCHING_COMPLETE_MESSAGE;

  // 대기 인원이 0명이면 매칭대기 빈 상태 문구·페이지 제목 변경과 같은 결론을 안내한다.
  return waitingCount === 0
    ? `${completeMessage} 모든 참여자가 매칭되었어요.`
    : `${completeMessage} 매칭 대기 ${waitingCount}명 남았어요.`;
};

const getSelectionAnnouncement = ({
  person,
  selectedGuideIds,
  selectedViId,
  replacedViName,
}: SelectionAnnouncementInput): string => {
  const isSelected =
    person.type === 'VI'
      ? selectedViId === person.userId
      : selectedGuideIds.includes(person.userId);

  if (!isSelected) {
    return `${person.name}님의 선택을 취소했습니다.`;
  }

  // 시각장애러너를 교체한 경우 기존 선택이 빠졌음을 명시한다. 그 외에는
  // 새로 선택한 사실만 안내한다.
  const selectionText = replacedViName
    ? `${replacedViName}에서 ${person.name}님으로 바꿨습니다.`
    : `${person.name}님을 선택했습니다.`;

  if (selectedViId === null) {
    return `${selectionText} 시각장애러너 파트너를 선택해주세요.`;
  }

  if (selectedGuideIds.length === 0) {
    return `${selectionText} 가이드러너 파트너를 선택해주세요.`;
  }

  return `${selectionText} 화면 최하단에 이대로 매칭하기를 눌러주세요.`;
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
  // 매칭 요청이 실제로 성공했을 때만 증가하는 카운터. 화면은 이 값으로 성공을
  // 감지해 포커스를 복구한다(선택 해제·실패 등 다른 전이와 구분하기 위함).
  const [matchingSuccessCount, setMatchingSuccessCount] = useState(0);
  // 매칭 완료 안내 문구는 즉시 낭독하지 않고 보관해 두었다가, 화면이 포커스
  // 복구를 마친 뒤 announceMatchingCompletion 으로 소비한다.
  const pendingCompletionAnnouncementRef = useRef<string | null>(null);
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

  // 선택 해제 확인 문구는 여기서 바로 주입하지 않는다. 해제 시 선택 바
  // 언마운트로 포커스 이동이 뒤따르는데, 즉시 주입하면 포커스 낭독에 잘리기
  // 때문에 호출부가 포커스 복구 후 announceSelectionCleared 로 지연 안내한다.
  const clearSelection = () => {
    setSelectedViId(null);
    setSelectedGuideIds([]);
  };

  const announceSelectionCleared = () => {
    announcePolitely('선택한 참가자를 모두 해제했습니다.');
  };

  // 보관해 둔 매칭 완료 안내를 소비한다. 포커스 복구(매칭대기 제목 낭독)가
  // 끝난 뒤 호출되므로 polite 리전으로도 완료 문장 전체가 끊기지 않는다.
  const announceMatchingCompletion = useCallback(() => {
    const message = pendingCompletionAnnouncementRef.current;
    pendingCompletionAnnouncementRef.current = null;

    if (message !== null) {
      setAnnouncement({ message, politeness: 'polite' });
    }
  }, []);

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
    onSuccess: async (data, variables) => {
      const viName = personMap.get(variables.viId)?.name;

      clearSelection();
      // 완료 안내를 즉시 assertive 로 주입하면 곧 이어지는 매칭대기 제목
      // 포커스 이동이 낭독을 중간에 끊는다. 문구를 보관해 두고 성공 카운터만
      // 올리면, 화면이 포커스를 먼저 복구한 뒤 안내를 지연 주입한다
      // (한 이벤트 = 한 낭독 채널).
      pendingCompletionAnnouncementRef.current = getMatchingCompleteAnnouncement(
        viName,
        data.summary.waitingCount,
      );
      setMatchingSuccessCount((count) => count + 1);
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
      const isDeselect = selectedViId === person.userId;
      const nextSelectedViId = isDeselect ? null : person.userId;
      // 다른 시각장애러너가 이미 선택돼 있었다면 이번 선택은 교체이므로,
      // 기존 선택이 조용히 빠지지 않도록 기존 이름을 함께 안내한다.
      const replacedViName =
        !isDeselect && selectedViId !== null
          ? (personMap.get(selectedViId)?.name ?? null)
          : null;

      setSelectedViId(nextSelectedViId);
      announcePolitely(
        getSelectionAnnouncement({
          person,
          selectedGuideIds,
          selectedViId: nextSelectedViId,
          replacedViName,
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
    announceMatchingCompletion,
    announceSelectionCleared,
    announcement,
    canCreateMatching,
    clearSelection,
    createMatching,
    hasSelection,
    isCreatingMatching: createMutation.isPending,
    matchingSuccessCount,
    pageState,
    selectedGuides,
    selectedUserIds,
    selectedVi,
    toggleParticipant,
  };
};

export type EventMatchPageModel = ReturnType<typeof useEventMatchPage>;
