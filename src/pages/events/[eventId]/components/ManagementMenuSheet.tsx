import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import type { RecruitStatus } from '@/api/types';
import {
  BottomSheet,
  ConfirmPopup,
  CONFIRM_POPUP_VARIANT,
  Icon,
  Text,
} from '@/components';
import { APP_PATH } from '@/router/path';

import { useEventManagementActions } from '../hooks/useEventManagementActions';

type ManagementMenuSheetProps = {
  canExtractAttendanceList: boolean;
  eventDate: string;
  eventId: number;
  eventName: string;
  open: boolean;
  recruitStatus: RecruitStatus;
  onClose: () => void;
};

export const ManagementMenuSheet = ({
  canExtractAttendanceList,
  eventDate,
  eventId,
  eventName,
  onClose,
  open,
  recruitStatus,
}: ManagementMenuSheetProps): ReactElement => {
  const navigate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const shouldShowCloseRecruitmentAction =
    recruitStatus !== 'RECRUIT_CLOSE' && recruitStatus !== 'RECRUIT_END';
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
    onClose,
    onDeleteSuccess: () => {
      setIsDeleteConfirmOpen(false);
    },
  });

  const handleEdit = () => {
    onClose();
    navigate(APP_PATH.EVENT_EDIT(eventId));
  };

  const handleAttendance = () => {
    downloadAttendanceCsv();
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
      <BottomSheet ariaLabel="이벤트 관리 메뉴" open={open} onClose={onClose}>
        <ManagementMenuList>
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
