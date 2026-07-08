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

import type { AttendancePageState } from './attendancePageState';
import { attendanceQueryKeys } from './queryKeys';
import { useEventDetailRoute } from '../EventDetailRouteContext';
import { canManageEventOperations } from '../utils/eventDetailPermissions';

type AttendanceMutationInput = {
  participantName: string;
  userId: string;
};

type LiveAnnouncement = {
  message: string;
  politeness: 'polite' | 'assertive';
};

const EMPTY_ANNOUNCEMENT: LiveAnnouncement = {
  message: '',
  politeness: 'polite',
};

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
  const updatingParticipantIdsRef = useRef(new Set<string>());

  const announceAssertively = (message: string) => {
    setAnnouncement({ message, politeness: 'assertive' });
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
    return true;
  };

  const finishParticipantUpdate = (userId: string) => {
    updatingParticipantIdsRef.current.delete(userId);
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
      return;
    }

    attendMutation.mutate({
      participantName: participant.name,
      userId: participant.userId,
    });
  };

  const cancelAttendance = (participant: AttendanceParticipant) => {
    if (!startParticipantUpdate(participant.userId)) {
      return;
    }

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
  };
};
