import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import type { AttendanceParticipant } from '@/api/types';
import { api } from '@/api/services';
import { APP_PATH } from '@/router/path';

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
  const eventId = getValidEventId(eventIdParam);
  const canFetchEventAttendance = eventId !== null;
  const [announcement, setAnnouncement] = useState('');

  const attendanceQuery = useQuery({
    queryKey: attendanceQueryKeys.status(eventId ?? 0),
    queryFn: () => {
      if (eventId === null) {
        throw new Error('Event ID is invalid.');
      }

      return api.attendance.statusGet({ eventId });
    },
    enabled: canFetchEventAttendance,
  });

  const canceledApplicantsQuery = useQuery({
    queryKey: attendanceQueryKeys.canceledApplicants(eventId ?? 0),
    queryFn: () => {
      if (eventId === null) {
        throw new Error('Event ID is invalid.');
      }

      return api.application.canceledApplicantsGet({ eventId });
    },
    enabled: canFetchEventAttendance,
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
      if (eventId === null) {
        throw new Error('Event ID is invalid.');
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
      if (eventId === null) {
        throw new Error('Event ID is invalid.');
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

  return {
    announcement,
    attendanceQuery,
    attendParticipant,
    canFetchEventAttendance,
    cancelAttendance,
    canceledApplicantsQuery,
    eventId,
    handleBack,
    isUpdatingAttendance,
  };
};
