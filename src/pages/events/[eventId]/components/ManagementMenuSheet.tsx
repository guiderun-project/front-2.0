import { useEffect, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import type { RecruitStatus } from '@/api/types';
import {
  BottomSheet,
  ConfirmPopup,
  CONFIRM_POPUP_VARIANT,
  HiddenText,
  Icon,
  Text,
} from '@/components';
import { APP_PATH } from '@/router/path';

import { useAnnouncedMessage } from '../hooks/useAnnouncedMessage';
import { useEventManagementActions } from '../hooks/useEventManagementActions';
import {
  getEventDateStartTimestamp,
  hasEventDateStarted,
} from '../utils/eventDetailCtaButtonConfigs';

const MAX_TIMEOUT_DELAY_MS = 2_147_483_647;

type ManagementMenuSheetProps = {
  canExtractAttendanceList: boolean;
  canManagePost: boolean;
  eventDate: string;
  eventId: number;
  eventName: string;
  open: boolean;
  recruitStatus: RecruitStatus;
  showOperationActions: boolean;
  onClose: () => void;
};

export const ManagementMenuSheet = ({
  canExtractAttendanceList,
  canManagePost,
  eventDate,
  eventId,
  eventName,
  onClose,
  open,
  recruitStatus,
  showOperationActions,
}: ManagementMenuSheetProps): ReactElement => {
  const navigate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [announcement, setAnnouncement] = useState({
    message: '',
    revision: 0,
  });
  // CSV 다운로드 성공처럼 시각 UI 가 없는 결과를 스크린리더에만 안내하는 리전.
  // 재다운로드 시 같은 문자열도 다시 낭독되도록 revision 으로 재주입을 트리거한다.
  const announcedMessage = useAnnouncedMessage(
    announcement.message,
    announcement.revision,
  );
  const isEventDateStarted =
    recruitStatus !== 'RECRUIT_UPCOMING' &&
    hasEventDateStarted(eventDate, currentTime);
  const shouldShowCloseRecruitmentAction =
    canManagePost &&
    recruitStatus !== 'RECRUIT_CLOSE' &&
    recruitStatus !== 'RECRUIT_END';
  const shouldShowMatchingAction =
    showOperationActions && recruitStatus !== 'RECRUIT_UPCOMING';
  const shouldShowAttendanceAction =
    showOperationActions &&
    (isEventDateStarted ||
      recruitStatus === 'RECRUIT_CLOSE' ||
      recruitStatus === 'RECRUIT_END');
  const {
    closeRecruitment,
    deleteEvent,
    downloadAttendanceCsv,
    isDeleteEventPending,
    isManagementMutating,
  } = useEventManagementActions({
    eventDate,
    eventId,
    eventName,
    onAnnounce: (message) => {
      setAnnouncement((previous) => ({
        message,
        revision: previous.revision + 1,
      }));
    },
    onClose,
    onDeleteSuccess: () => {
      setIsDeleteConfirmOpen(false);
    },
  });

  useEffect(() => {
    const eventDateStartTimestamp = getEventDateStartTimestamp(eventDate);

    if (
      eventDateStartTimestamp === null ||
      currentTime >= eventDateStartTimestamp
    ) {
      return;
    }

    const delay = Math.min(
      eventDateStartTimestamp - currentTime,
      MAX_TIMEOUT_DELAY_MS,
    );
    const timeoutId = window.setTimeout(() => {
      setCurrentTime(Date.now());
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentTime, eventDate]);

  const handleEdit = () => {
    onClose();
    navigate(APP_PATH.EVENT_EDIT(eventId));
  };

  const handleAttendance = () => {
    downloadAttendanceCsv();
  };

  const handleMatchManagement = () => {
    onClose();
    navigate(APP_PATH.EVENT_MATCH(eventId));
  };

  const handleAttendanceManagement = () => {
    onClose();
    navigate(APP_PATH.EVENT_ATTENDANCE(eventId));
  };

  const handleCloseRecruitment = () => {
    closeRecruitment();
  };

  const handleDelete = () => {
    onClose();
    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    if (isDeleteEventPending) {
      return;
    }

    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteEvent();
  };

  return (
    <>
      <HiddenText role="status">{announcedMessage}</HiddenText>
      <BottomSheet ariaLabel="이벤트 관리 메뉴" open={open} onClose={onClose}>
        <ManagementMenuList>
          {shouldShowMatchingAction ? (
            <ManagementMenuItem
              disabled={isManagementMutating}
              type="button"
              onClick={handleMatchManagement}
            >
              <Icon
                aria-hidden={true}
                color="icon.secondary"
                icon="match-lined"
                size={20}
              />
              <Text color="text.primary" font="body-m-m">
                매칭하기
              </Text>
            </ManagementMenuItem>
          ) : null}
          {shouldShowAttendanceAction ? (
            <ManagementMenuItem
              disabled={isManagementMutating}
              type="button"
              onClick={handleAttendanceManagement}
            >
              <Icon
                aria-hidden={true}
                color="icon.secondary"
                icon="attendance-lined"
                size={20}
              />
              <Text color="text.primary" font="body-m-m">
                출석하기
              </Text>
            </ManagementMenuItem>
          ) : null}
          {shouldShowCloseRecruitmentAction ? (
            <ManagementMenuItem
              disabled={isManagementMutating}
              type="button"
              onClick={handleCloseRecruitment}
            >
              <Icon
                aria-hidden={true}
                color="icon.secondary"
                icon="user-x-lined"
                size={20}
              />
              <Text color="text.primary" font="body-m-m">
                모집 마감하기
              </Text>
            </ManagementMenuItem>
          ) : null}
          {canManagePost ? (
            <>
              <ManagementMenuItem
                disabled={isManagementMutating}
                type="button"
                onClick={handleEdit}
              >
                <Icon
                  aria-hidden={true}
                  color="icon.secondary"
                  icon="edit-lined"
                  size={20}
                />
                <Text color="text.primary" font="body-m-m">
                  모집 게시글 수정하기
                </Text>
              </ManagementMenuItem>
              <ManagementMenuItem
                disabled={isManagementMutating}
                type="button"
                onClick={handleDelete}
              >
                <Icon
                  aria-hidden={true}
                  color="icon.secondary"
                  icon="trash-lined"
                  size={20}
                />
                <Text color="text.primary" font="body-m-m">
                  모집 게시글 삭제하기
                </Text>
              </ManagementMenuItem>
            </>
          ) : null}
          {canExtractAttendanceList ? (
            <ManagementMenuItem
              disabled={isManagementMutating}
              type="button"
              onClick={handleAttendance}
            >
              <Icon
                aria-hidden={true}
                color="icon.secondary"
                icon="download-lined"
                size={20}
              />
              <Text color="text.primary" font="body-m-m">
                출석 인원 명단 추출
              </Text>
            </ManagementMenuItem>
          ) : null}
        </ManagementMenuList>
      </BottomSheet>
      <ConfirmPopup
        confirmLoading={isDeleteEventPending}
        confirmText="삭제하기"
        description="삭제한 게시글은 다시 복구할 수 없어요"
        open={isDeleteConfirmOpen}
        title="모임 게시글을 삭제할까요?"
        variant={CONFIRM_POPUP_VARIANT.DANGER}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

const ManagementMenuList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const ManagementMenuItem = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
  minHeight: theme.pxToRem(56),
  padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
  border: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  touchAction: 'manipulation',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: `-${theme.spacing.sm}`,
  },

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.color.bg.overlay,
    },
  },

  '&:active': {
    backgroundColor: theme.color.bg.surface,
  },

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.48,
  },
}));
