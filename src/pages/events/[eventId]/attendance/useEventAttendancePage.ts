import { useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import type { AttendanceParticipant } from '@/api/types';
import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

import type { AttendancePageState } from './attendancePageState';
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

export const useEventAttendanceRoute = () => {
  const { eventId: eventIdParam } = useParams();
  const navigate = useNavigate();
  const eventId = getValidEventId(eventIdParam);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(eventId === null ? APP_PATH.EVENTS : APP_PATH.EVENT_DETAIL(eventId));
  };

  return {
    eventId,
    onBack: handleBack,
  };
};

export const useEventAttendancePermission = (eventId: number) => {
  const { user } = useAuth();
  const viewerKey = getEventDetailViewerKey(user?.userId);
  const { data: event } = useSuspenseQuery({
    queryKey: eventDetailQueryKeys.detail(eventId, viewerKey),
    queryFn: () => api.event.detailGet({ eventId }),
  });

  return {
    canManageAttendance:
      user !== null &&
      (event.viewer?.isOrganizer === true || user.role === 'ROLE_ADMIN'),
  };
};

export const useEventAttendancePage = (eventId: number) => {
  const queryClient = useQueryClient();
  const [announcement, setAnnouncement] = useState('');

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
  });

  const attendParticipant = (participant: AttendanceParticipant) => {
    attendMutation.mutate({
      participantName: participant.name,
      userId: participant.userId,
    });
  };

  const cancelAttendance = (participant: AttendanceParticipant) => {
    cancelAttendanceMutation.mutate({
      participantName: participant.name,
      userId: participant.userId,
    });
  };

  const isUpdatingAttendance =
    attendMutation.isPending || cancelAttendanceMutation.isPending;

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
    isUpdatingAttendance,
  };
};
