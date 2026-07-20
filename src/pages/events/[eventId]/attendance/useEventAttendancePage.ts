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
  const pendingFocusTargetRef = useRef<AttendanceFocusTarget | null>(null);

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

  const restoreFocusAfterUpdate = () => {
    const focusTarget = pendingFocusTargetRef.current;
    pendingFocusTargetRef.current = null;

    if (focusTarget === null) {
      return;
    }

    // 재조회로 카드가 다른 섹션으로 옮겨진 다음 프레임에 포커스를 되돌려
    // 스크린리더 커서가 페이지 처음으로 리셋되지 않게 한다.
    window.requestAnimationFrame(() => {
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
      restoreFocusAfterUpdate();
    },
    onError: (error, participant) => {
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
      restoreFocusAfterUpdate();
    },
    onError: (error, participant) => {
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

    pendingFocusTargetRef.current = captureNextActionFocusTarget(
      'waiting',
      participant.userId,
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

    pendingFocusTargetRef.current = captureNextActionFocusTarget(
      'attended',
      participant.userId,
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
