import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet, Button, type BottomSheetHeading } from '@/components';

type RestrictedAccessSheetProps = {
  isApprovalPending: boolean;
  isAuthenticated: boolean;
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
};

export const RestrictedAccessSheet = ({
  isApprovalPending,
  isAuthenticated,
  onClose,
  onLogin,
  open,
}: RestrictedAccessSheetProps): ReactElement => {
  const heading = getRestrictedAccessHeading({
    isApprovalPending,
    isAuthenticated,
  });

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

const DescriptionEmphasis = styled.span(({ theme }) => ({
  color: theme.color.text.brand,
}));

const getRestrictedAccessHeading = ({
  isApprovalPending,
  isAuthenticated,
}: Pick<RestrictedAccessSheetProps, 'isApprovalPending' | 'isAuthenticated'>): BottomSheetHeading => {
  if (isApprovalPending) {
    return {
      title: '가입 승인 후에 이용할 수 있어요',
      description: (
        <>
          안전한 러닝 환경을 위해 정보를 확인하고 있어요.
          <br />
          <DescriptionEmphasis>하루 이내</DescriptionEmphasis>에 카카오톡으로
          안내드릴게요
        </>
      ),
    };
  }

  if (isAuthenticated) {
    return {
      title: '승인 후 이용할 수 있어요.',
      description: '신청자 명단과 매칭 현황은 승인된 회원만 볼 수 있어요.',
    };
  }

  return {
    title: '지금 로그인하고 계속할까요?',
    description: '이 기능은 로그인 후 이용할 수 있어요.',
  };
};
