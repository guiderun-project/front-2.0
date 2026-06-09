import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';

type LoginRequiredSheetProps = {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
};

/**
 * 비로그인 사용자가 로그인 필요한 메뉴(마이페이지 등)를 누를 때 노출하는 로그인 안내 시트.
 */
export const LoginRequiredSheet = ({
  onClose,
  onLogin,
  open,
}: LoginRequiredSheetProps): ReactElement => {
  return (
    <BottomSheet
      heading={{
        title: '지금 로그인하고 계속할까요?',
        description: '마이페이지는 로그인 후 이용할 수 있어요.',
      }}
      open={open}
      onClose={onClose}
      footer={
        <Actions>
          <Button fullWidth level="secondary" size="l" onClick={onClose}>
            아니요
          </Button>
          <Button fullWidth size="l" onClick={onLogin}>
            로그인하기
          </Button>
        </Actions>
      }
    />
  );
};

const Actions = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `${theme.pxToRem(112)} minmax(0, 1fr)`,
  gap: theme.spacing.md,
  width: '100%',
}));
