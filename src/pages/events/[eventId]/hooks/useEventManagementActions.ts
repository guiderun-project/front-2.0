import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ANALYTICS_EVENT, getApiErrorMessage, trackEvent } from '@/api/core';
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
  /** 시각 UI 없이 스크린리더 전용 라이브 리전으로 안내할 때 호출한다. */
  onAnnounce?: (message: string) => void;
  onClose: () => void;
  onDeleteSuccess: () => void;
};

export const useEventManagementActions = ({
  eventDate,
  eventId,
  eventName,
  onAnnounce,
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
    onError: (error) => {
      showToast({
        type: 'error',
        icon: 'alert-circle-filled',
        content: getApiErrorMessage(error, '모집 마감에 실패했어요.'),
      });
    },
  });
  const deleteEventMutation = useMutation({
    mutationFn: () => api.event.delete({ eventId }),
    onSuccess: () => {
      onDeleteSuccess();
      onClose();
      void queryClient.invalidateQueries({ queryKey: eventDetailQueryKeys.root });
      // SPA 라우트 전환은 자동으로 낭독되지 않으므로 RouteAnnouncer 가
      // 목록 페이지 제목 대신 삭제 성공 사유를 낭독하도록 state 로 전달한다.
      navigate(APP_PATH.EVENTS, {
        state: { srAnnouncement: '모집 게시글을 삭제했어요.' },
      });
    },
    onError: (error) => {
      window.alert(getApiErrorMessage(error, '모집 게시글 삭제에 실패했어요.'));
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
        trackEvent(ANALYTICS_EVENT.ATTENDANCE_LIST_EXPORTED, {
          eventId,
          guideCount: items.length,
        });
        onClose();
        // 다운로드 성공은 기존처럼 시각 UI 를 띄우지 않으므로,
        // 스크린리더 전용 라이브 리전으로만 완료를 안내한다.
        onAnnounce?.('출석 인원 명단을 내려받았어요.');
      } catch {
        window.alert('출석 인원 명단 추출에 실패했어요.');
      }
    },
    onError: (error) => {
      window.alert(
        getApiErrorMessage(error, '출석 인원 명단 추출에 실패했어요.'),
      );
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
