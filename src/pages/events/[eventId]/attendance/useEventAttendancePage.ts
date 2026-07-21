import { useRef, useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '@/api/core';
import type { AttendanceParticipant } from '@/api/types';
import { api } from '@/api/services';
import { useToast } from '@/components';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import {
  captureNextActionFocusTarget,
  focusAttendanceTarget,
  type AttendanceFocusTarget,
} from './attendanceActionFocus';
import type { AttendancePageState } from './attendancePageState';
import { attendanceQueryKeys } from './queryKeys';
import { useEventDetailRoute } from '../EventDetailRouteContext';
import { canManageEventOperations } from '../utils/eventDetailPermissions';

type AttendanceMutationInput = {
  participantName: string;
  userId: string;
};

type LiveAnnouncement = {
  id: number;
  message: string;
  politeness: 'polite' | 'assertive';
};

const EMPTY_ANNOUNCEMENT: LiveAnnouncement = {
  id: 0,
  message: '',
  politeness: 'polite',
};

const UPDATING_ANNOUNCEMENT_MESSAGE = '처리 중이에요';

export const useEventAttendanceRoute = () => {
  const navigate = useNavigate();
  const { eventId, isValidEventId } = useEventDetailRoute();
  const validEventId = isValidEventId ? eventId : null;

  const handleBack = () => {
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
    onBack: handleBack,
  };
};

export const useEventAttendancePermission = () => {
  const { user } = useAuth();
  const { event } = useEventDetailRoute();

  return {
    canManageAttendance: canManageEventOperations({ event, user }),
  };
};

export const useEventAttendancePage = (eventId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [announcement, setAnnouncement] =
    useState<LiveAnnouncement>(EMPTY_ANNOUNCEMENT);
  const [updatingParticipantIds, setUpdatingParticipantIds] = useState<
    ReadonlySet<string>
  >(new Set<string>());
  const updatingParticipantIdsRef = useRef(new Set<string>());
  // 출석 체크인은 연속 탭이 기본 흐름이라 여러 뮤테이션이 겹칠 수 있다.
  // 참가자별로 포커스 복구 목적지를 보관해 각 성공이 자기 목적지만 소비한다.
  const pendingFocusTargetsRef = useRef(
    new Map<string, AttendanceFocusTarget>(),
  );

  const announce = (
    message: string,
    politeness: LiveAnnouncement['politeness'],
  ) => {
    // 같은 메시지가 연속 발생해도 재낭독되도록 id를 함께 증가시킨다.
    setAnnouncement((previous) => ({
      id: previous.id + 1,
      message,
      politeness,
    }));
  };

  const announceAssertively = (message: string) => {
    announce(message, 'assertive');
  };

  const announcePolitely = (message: string) => {
    announce(message, 'polite');
  };

  const [attendanceQuery, canceledApplicantsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: attendanceQueryKeys.status(eventId),
        queryFn: () => api.attendance.statusGet({ eventId }),
      },
      {
        queryKey: attendanceQueryKeys.canceledApplicants(eventId),
        queryFn: () => api.application.canceledApplicantsGet({ eventId }),
      },
    ],
  });

  const invalidateAttendanceStatus = async () => {
    await queryClient.invalidateQueries({
      queryKey: attendanceQueryKeys.status(eventId),
    });
  };

  const startParticipantUpdate = (userId: string): boolean => {
    if (updatingParticipantIdsRef.current.has(userId)) {
      return false;
    }

    updatingParticipantIdsRef.current.add(userId);
    setUpdatingParticipantIds(new Set(updatingParticipantIdsRef.current));
    return true;
  };

  const finishParticipantUpdate = (userId: string) => {
    updatingParticipantIdsRef.current.delete(userId);
    setUpdatingParticipantIds(new Set(updatingParticipantIdsRef.current));
  };

  const restoreFocusAfterUpdate = (userId: string) => {
    const focusTarget = pendingFocusTargetsRef.current.get(userId);
    pendingFocusTargetsRef.current.delete(userId);

    if (focusTarget === undefined) {
      return;
    }

    // 재조회로 카드가 다른 섹션으로 옮겨진 다음 프레임에 포커스를 되돌려
    // 스크린리더 커서가 페이지 처음으로 리셋되지 않게 한다.
    window.requestAnimationFrame(() => {
      // RouteFocusManager(App.tsx)와 같은 원칙으로, 이미 포커스가 살아 있으면
      // 개입하지 않는다. 포커스가 body 로 떨어졌거나(카드 언마운트), 방금
      // 처리한 참가자의 액션 버튼(곧 이동·언마운트될 요소)에 남아 있는
      // 경우에만 기억해 둔 목적지로 복구한다.
      const active = document.activeElement;
      const isFocusLost =
        active === null || active === document.body || !active.isConnected;
      const isOnProcessedActionButton =
        active instanceof HTMLElement &&
        active.dataset.attendanceAction !== undefined &&
        active.dataset.userId === userId;

      if (!isFocusLost && !isOnProcessedActionButton) {
        return;
      }

      focusAttendanceTarget(focusTarget);
    });
  };

  const attendMutation = useMutation({
    mutationFn: ({ userId }: AttendanceMutationInput) =>
      api.attendance.attendPost({ eventId, userId }),
    onSuccess: async (_, participant) => {
      const successMessage = `${participant.participantName}님 출석을 완료했어요`;

      announceAssertively(successMessage);
      showToast({
        type: 'success',
        icon: 'check-thick-lined',
        content: successMessage,
        announce: false,
      });
      await invalidateAttendanceStatus();
      restoreFocusAfterUpdate(participant.userId);
    },
    onError: (error, participant) => {
      // 실패 시에는 포커스 복구가 실행되지 않으므로 stale 목적지를 정리한다.
      pendingFocusTargetsRef.current.delete(participant.userId);
      announceAssertively(
        getApiErrorMessage(
          error,
          `${participant.participantName}님 출석 처리에 실패했어요.`,
        ),
      );
    },
    onSettled: (_, __, participant) => {
      finishParticipantUpdate(participant.userId);
    },
  });

  const cancelAttendanceMutation = useMutation({
    mutationFn: ({ userId }: AttendanceMutationInput) =>
      api.attendance.attendDelete({ eventId, userId }),
    onSuccess: async (_, participant) => {
      const successMessage = `${participant.participantName}님 출석을 취소했어요`;

      announceAssertively(successMessage);
      showToast({
        type: 'error',
        icon: 'delete-lined',
        content: successMessage,
        announce: false,
      });
      await invalidateAttendanceStatus();
      restoreFocusAfterUpdate(participant.userId);
    },
    onError: (error, participant) => {
      // 실패 시에는 포커스 복구가 실행되지 않으므로 stale 목적지를 정리한다.
      pendingFocusTargetsRef.current.delete(participant.userId);
      announceAssertively(
        getApiErrorMessage(
          error,
          `${participant.participantName}님 출석 취소에 실패했어요.`,
        ),
      );
    },
    onSettled: (_, __, participant) => {
      finishParticipantUpdate(participant.userId);
    },
  });

  const attendParticipant = (participant: AttendanceParticipant) => {
    if (!startParticipantUpdate(participant.userId)) {
      announcePolitely(UPDATING_ANNOUNCEMENT_MESSAGE);
      return;
    }

    pendingFocusTargetsRef.current.set(
      participant.userId,
      captureNextActionFocusTarget('waiting', participant.userId),
    );
    attendMutation.mutate({
      participantName: participant.name,
      userId: participant.userId,
    });
  };

  const cancelAttendance = (participant: AttendanceParticipant) => {
    if (!startParticipantUpdate(participant.userId)) {
      announcePolitely(UPDATING_ANNOUNCEMENT_MESSAGE);
      return;
    }

    pendingFocusTargetsRef.current.set(
      participant.userId,
      captureNextActionFocusTarget('attended', participant.userId),
    );
    cancelAttendanceMutation.mutate({
      participantName: participant.name,
      userId: participant.userId,
    });
  };

  const attendancePageState: AttendancePageState = {
    attendance: attendanceQuery.data,
    canceledParticipants: canceledApplicantsQuery.data.canceledApplicants,
    status: 'ready',
  };

  return {
    announcement,
    attendancePageState,
    attendParticipant,
    cancelAttendance,
    updatingParticipantIds,
  };
};
