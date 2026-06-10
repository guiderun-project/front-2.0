import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import type { AttendanceParticipant } from '@/api/types';
import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import type {
  AttendancePageState,
  CanceledAttendanceParticipantsState,
} from './attendancePageState';
import { eventDetailQueryKeys, getEventDetailViewerKey } from '../queryKeys';

const attendanceQueryKeys = {
  root: ['event', 'attendance'] as const,
  status: (eventId: number) =>
    [...attendanceQueryKeys.root, 'status', eventId] as const,
  canceledApplicants: (eventId: number) =>
    [...attendanceQueryKeys.root, 'canceled-applicants', eventId] as const,
};

type AttendanceMutationInput = {
  participantName: string;
  userId: string;
};

const getValidEventId = (eventIdParam: string | undefined): number | null => {
  const eventId = Number(eventIdParam);

  return Number.isInteger(eventId) && eventId > 0 ? eventId : null;
};

export const useEventAttendancePage = () => {
  const { eventId: eventIdParam } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthReady, user } = useAuth();
  const eventId = getValidEventId(eventIdParam);
  const canFetchEventAttendance = eventId !== null;
  const viewerKey = getEventDetailViewerKey(user?.userId);
  const [announcement, setAnnouncement] = useState('');

  const eventDetailQuery = useQuery({
    queryKey: eventDetailQueryKeys.detail(eventId ?? 0, viewerKey),
    queryFn: () => {
      if (eventId === null) {
        throw new Error('Event ID is invalid.');
      }

      return api.event.detailGet({ eventId });
    },
    enabled: canFetchEventAttendance && isAuthReady,
  });

  const event = eventDetailQuery.data ?? null;
  const canManageAttendance =
    event !== null &&
    user !== null &&
    (event.viewer?.isOrganizer === true || user.role === 'ROLE_ADMIN');
  const isAttendancePermissionPending =
    canFetchEventAttendance && (!isAuthReady || eventDetailQuery.isPending);
  const isAttendancePermissionError =
    canFetchEventAttendance && eventDetailQuery.isError;

  const attendanceQuery = useQuery({
    queryKey: attendanceQueryKeys.status(eventId ?? 0),
    queryFn: () => {
      if (eventId === null) {
        throw new Error('Event ID is invalid.');
      }

      return api.attendance.statusGet({ eventId });
    },
    enabled: canManageAttendance,
  });

  const canceledApplicantsQuery = useQuery({
    queryKey: attendanceQueryKeys.canceledApplicants(eventId ?? 0),
    queryFn: () => {
      if (eventId === null) {
        throw new Error('Event ID is invalid.');
      }

      return api.application.canceledApplicantsGet({ eventId });
    },
    enabled: canManageAttendance,
  });

  const invalidateAttendanceStatus = async () => {
    if (eventId === null) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: attendanceQueryKeys.status(eventId),
    });
  };

  const attendMutation = useMutation({
    mutationFn: ({ userId }: AttendanceMutationInput) => {
      if (eventId === null || !canManageAttendance) {
        throw new Error('Attendance permission is required.');
      }

      return api.attendance.attendPost({ eventId, userId });
    },
    onSuccess: async (_, participant) => {
      setAnnouncement(`${participant.participantName}님을 출석 처리했습니다.`);
      await invalidateAttendanceStatus();
    },
    onError: (_, participant) => {
      setAnnouncement(`${participant.participantName}님 출석 처리에 실패했습니다.`);
    },
  });

  const cancelAttendanceMutation = useMutation({
    mutationFn: ({ userId }: AttendanceMutationInput) => {
      if (eventId === null || !canManageAttendance) {
        throw new Error('Attendance permission is required.');
      }

      return api.attendance.attendDelete({ eventId, userId });
    },
    onSuccess: async (_, participant) => {
      setAnnouncement(`${participant.participantName}님 출석을 취소했습니다.`);
      await invalidateAttendanceStatus();
    },
    onError: (_, participant) => {
      setAnnouncement(`${participant.participantName}님 출석 취소에 실패했습니다.`);
    },
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(eventId === null ? APP_PATH.EVENTS : APP_PATH.EVENT_DETAIL(eventId));
  };

  const attendParticipant = (participant: AttendanceParticipant) => {
    if (!canManageAttendance) {
      setAnnouncement('출석 관리는 이벤트 주최자 또는 관리자만 가능해요.');
      return;
    }

    attendMutation.mutate({
      participantName: participant.name,
      userId: participant.userId,
    });
  };

  const cancelAttendance = (participant: AttendanceParticipant) => {
    if (!canManageAttendance) {
      setAnnouncement('출석 관리는 이벤트 주최자 또는 관리자만 가능해요.');
      return;
    }

    cancelAttendanceMutation.mutate({
      participantName: participant.name,
      userId: participant.userId,
    });
  };

  const isUpdatingAttendance =
    attendMutation.isPending || cancelAttendanceMutation.isPending;

  const canceledParticipantsState: CanceledAttendanceParticipantsState =
    (() => {
      if (canceledApplicantsQuery.isPending) {
        return { status: 'pending' };
      }

      if (canceledApplicantsQuery.isError) {
        return { status: 'error' };
      }

      return {
        participants: canceledApplicantsQuery.data?.canceledApplicants ?? [],
        status: 'ready',
      };
    })();

  const attendancePageState: AttendancePageState = (() => {
    if (!canFetchEventAttendance) {
      return { status: 'invalid-event' };
    }

    if (isAttendancePermissionPending) {
      return { status: 'permission-pending' };
    }

    if (isAttendancePermissionError) {
      return { status: 'permission-error' };
    }

    if (!canManageAttendance) {
      return { status: 'forbidden' };
    }

    if (attendanceQuery.isPending) {
      return { status: 'attendance-pending' };
    }

    if (attendanceQuery.isError || !attendanceQuery.data) {
      return { status: 'attendance-error' };
    }

    return {
      attendance: attendanceQuery.data,
      canceledParticipants: canceledParticipantsState,
      status: 'ready',
    };
  })();

  return {
    announcement,
    attendancePageState,
    attendParticipant,
    cancelAttendance,
    handleBack,
    isUpdatingAttendance,
  };
};
