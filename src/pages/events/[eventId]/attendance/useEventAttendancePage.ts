import { useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { AttendanceParticipant } from '@/api/types';
import { api } from '@/api/services';
import { USER_ROLES } from '@/constants/roles';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import type { AttendancePageState } from './attendancePageState';
import { attendanceQueryKeys } from './queryKeys';
import { useEventDetailRoute } from '../EventDetailRouteContext';

type AttendanceMutationInput = {
  participantName: string;
  userId: string;
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
    canManageAttendance:
      user !== null &&
      (event.viewer?.isOrganizer === true || user.role === USER_ROLES.ADMIN),
  };
};

export const useEventAttendancePage = (eventId: number) => {
  const queryClient = useQueryClient();
  const [announcement, setAnnouncement] = useState('');
  const [updatingParticipantIds, setUpdatingParticipantIds] = useState<
    ReadonlySet<string>
  >(() => new Set());

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

  const addUpdatingParticipant = (userId: string) => {
    setUpdatingParticipantIds((previousIds) => {
      const nextIds = new Set(previousIds);
      nextIds.add(userId);

      return nextIds;
    });
  };

  const removeUpdatingParticipant = (userId: string) => {
    setUpdatingParticipantIds((previousIds) => {
      const nextIds = new Set(previousIds);
      nextIds.delete(userId);

      return nextIds;
    });
  };

  const attendMutation = useMutation({
    mutationFn: ({ userId }: AttendanceMutationInput) =>
      api.attendance.attendPost({ eventId, userId }),
    onSuccess: async (_, participant) => {
      setAnnouncement(`${participant.participantName}님을 출석 처리했어요.`);
      await invalidateAttendanceStatus();
    },
    onError: (_, participant) => {
      setAnnouncement(`${participant.participantName}님 출석 처리에 실패했어요.`);
    },
    onSettled: (_, __, participant) => {
      removeUpdatingParticipant(participant.userId);
    },
  });

  const cancelAttendanceMutation = useMutation({
    mutationFn: ({ userId }: AttendanceMutationInput) =>
      api.attendance.attendDelete({ eventId, userId }),
    onSuccess: async (_, participant) => {
      setAnnouncement(`${participant.participantName}님 출석을 취소했어요.`);
      await invalidateAttendanceStatus();
    },
    onError: (_, participant) => {
      setAnnouncement(`${participant.participantName}님 출석 취소에 실패했어요.`);
    },
    onSettled: (_, __, participant) => {
      removeUpdatingParticipant(participant.userId);
    },
  });

  const attendParticipant = (participant: AttendanceParticipant) => {
    if (updatingParticipantIds.has(participant.userId)) {
      return;
    }

    addUpdatingParticipant(participant.userId);
    attendMutation.mutate({
      participantName: participant.name,
      userId: participant.userId,
    });
  };

  const cancelAttendance = (participant: AttendanceParticipant) => {
    if (updatingParticipantIds.has(participant.userId)) {
      return;
    }

    addUpdatingParticipant(participant.userId);
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
