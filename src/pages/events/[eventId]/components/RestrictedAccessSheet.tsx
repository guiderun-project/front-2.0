import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet, Button } from '@/components';

type RestrictedAccessSheetProps = {
  isAuthenticated: boolean;
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
};

export const RestrictedAccessSheet = ({
  isAuthenticated,
  onClose,
  onLogin,
  open,
}: RestrictedAccessSheetProps): ReactElement => {
  const heading = isAuthenticated
    ? {
        title: '승인 후 이용할 수 있어요.',
        description: '신청자 명단과 매칭 현황은 승인된 회원만 볼 수 있어요.',
      }
    : {
        title: '지금 로그인하고 계속할까요?',
        description: '이 기능은 로그인 후 이용할 수 있어요.',
      };

  return (
    <BottomSheet
      heading={heading}
      open={open}
      onClose={onClose}
      footer={
        isAuthenticated ? (
          <SingleSheetAction>
            <Button fullWidth size="l" onClick={onClose}>
              확인
            </Button>
          </SingleSheetAction>
        ) : (
          <SheetActions>
            <Button fullWidth size="l" level="secondary" onClick={onClose}>
              아니요
            </Button>
            <Button fullWidth size="l" onClick={onLogin}>
              로그인하기
            </Button>
          </SheetActions>
        )
      }
    />
  );
};

const SheetActions = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `${theme.pxToRem(112)} minmax(0, 1fr)`,
  gap: theme.spacing.md,
  width: '100%',
}));

const SingleSheetAction = styled.div({
  width: '100%',
});
