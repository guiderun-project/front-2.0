import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  BottomSheet,
  ConfirmPopup,
  CONFIRM_POPUP_VARIANT,
  Icon,
  Text,
} from '@/components';
import { api } from '@/api/services';
import { APP_PATH } from '@/router/path';

import { eventDetailQueryKeys } from '../queryKeys';

type ManagementMenuSheetProps = {
  eventId: number;
  open: boolean;
  onClose: () => void;
};

export const ManagementMenuSheet = ({
  eventId,
  onClose,
  open,
}: ManagementMenuSheetProps): ReactElement => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const closeRecruitmentMutation = useMutation({
    mutationFn: () => api.event.closePatch({ eventId }),
    onSuccess: () => {
      onClose();
      void queryClient.invalidateQueries({
        queryKey: eventDetailQueryKeys.detailRoot(eventId),
      });
    },
    onError: () => {
      window.alert('모집 마감에 실패했어요.');
    },
  });
  const deleteEventMutation = useMutation({
    mutationFn: () => api.event.delete({ eventId }),
    onSuccess: () => {
      setIsDeleteConfirmOpen(false);
      onClose();
      void queryClient.invalidateQueries({ queryKey: eventDetailQueryKeys.root });
      navigate(APP_PATH.EVENTS);
    },
    onError: () => {
      window.alert('모집 게시글 삭제에 실패했어요.');
    },
  });
  const isManagementMutating =
    closeRecruitmentMutation.isPending || deleteEventMutation.isPending;

  const handleEdit = () => {
    onClose();
    navigate(APP_PATH.EVENT_EDIT(eventId));
  };

  const handleAttendance = () => {
    onClose();
    navigate(APP_PATH.EVENT_ATTENDANCE(eventId));
  };

  const handleCloseRecruitment = () => {
    closeRecruitmentMutation.mutate();
  };

  const handleDelete = () => {
    onClose();
    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    if (deleteEventMutation.isPending) {
      return;
    }

    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteEventMutation.mutate();
  };

  return (
    <>
      <BottomSheet ariaLabel="이벤트 관리 메뉴" open={open} onClose={onClose}>
        <ManagementMenuList>
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
        </ManagementMenuList>
      </BottomSheet>
      <ConfirmPopup
        confirmLoading={deleteEventMutation.isPending}
        confirmText="삭제하기"
        description="삭제한 모집 게시글은 다시 복구할 수 없어요."
        open={isDeleteConfirmOpen}
        title="모집 게시글을 삭제할까요?"
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
