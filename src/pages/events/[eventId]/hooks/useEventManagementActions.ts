import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/services';
import { useToast } from '@/components';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys } from '../queryKeys';
import {
  buildAttendanceGuideCsvFilename,
  buildAttendedGuideRunnerCsv,
  downloadCsvFile,
} from '../utils/attendanceCsv';

type UseEventManagementActionsParams = {
  eventDate: string;
  eventId: number;
  eventName: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
};

export const useEventManagementActions = ({
  eventDate,
  eventId,
  eventName,
  onClose,
  onDeleteSuccess,
}: UseEventManagementActionsParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const closeRecruitmentMutation = useMutation({
    mutationFn: () => api.event.closePatch({ eventId }),
    onSuccess: () => {
      onClose();
      showToast({
        type: 'success',
        icon: 'check-lined',
        content: '모집을 마감했어요.',
      });
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.detailRoot(eventId),
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        icon: 'alert-circle-filled',
        content: '모집 마감에 실패했어요.',
      });
    },
  });
  const deleteEventMutation = useMutation({
    mutationFn: () => api.event.delete({ eventId }),
    onSuccess: () => {
      onDeleteSuccess();
      onClose();
      void queryClient.invalidateQueries({ queryKey: eventDetailQueryKeys.root });
      navigate(APP_PATH.EVENTS);
    },
    onError: () => {
      window.alert('모집 게시글 삭제에 실패했어요.');
    },
  });
  const downloadAttendanceCsvMutation = useMutation({
    mutationFn: () => api.attendance.attendedGuidesGet({ eventId }),
    onSuccess: ({ items }) => {
      try {
        const content = buildAttendedGuideRunnerCsv(items);
        const filename = buildAttendanceGuideCsvFilename({
          eventDate,
          eventId,
          eventName,
        });

        downloadCsvFile({ content, filename });
        onClose();
      } catch {
        window.alert('출석 인원 명단 추출에 실패했어요.');
      }
    },
    onError: () => {
      window.alert('출석 인원 명단 추출에 실패했어요.');
    },
  });

  return {
    closeRecruitment: closeRecruitmentMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    downloadAttendanceCsv: downloadAttendanceCsvMutation.mutate,
    isDeleteEventPending: deleteEventMutation.isPending,
    isManagementMutating:
      closeRecruitmentMutation.isPending ||
      deleteEventMutation.isPending ||
      downloadAttendanceCsvMutation.isPending,
  };
};
