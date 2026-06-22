import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet, Button, Input } from '@/components';

import { useAccountSetup } from '../hooks/useAccountSetup';

const PASSWORD_HELPER_TEXT =
  '영문, 특수문자를 포함해 8자 이상 32자 미만 입력해주세요';

type AccountSetupSheetProps = {
  open: boolean;
  onClose: () => void;
};

export const AccountSetupSheet = ({
  open,
  onClose,
}: AccountSetupSheetProps): ReactElement => {
  const {
    accountId,
    setAccountId,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    accountIdStatus,
    isCheckingAccountId,
    checkAccountIdDuplicate,
    hasPasswordError,
    hasPasswordConfirmError,
    canSubmit,
    submit,
    reset,
  } = useAccountSetup();

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = async () => {
    const isSucceeded = await submit();

    if (isSucceeded) {
      handleClose();
    }
  };

  return (
    <BottomSheet
      open={open}
      topBarTitle="아이디 설정"
      footer={
        <Button
          disabled={!canSubmit}
          fullWidth
          size="l"
          onClick={handleSubmit}
        >
          확인
        </Button>
      }
      onClose={handleClose}
    >
      <Fields>
        <Input
          autoComplete="username"
          errorText={
            accountIdStatus === 'taken' ? '이미 사용 중인 아이디예요' : undefined
          }
          helperText={
            accountIdStatus === 'available' ? '사용 가능한 아이디예요' : undefined
          }
          label="아이디"
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          trailing={
            <CheckButton
              disabled={
                !accountId ||
                isCheckingAccountId ||
                accountIdStatus !== 'unchecked'
              }
              size="s"
              onClick={checkAccountIdDuplicate}
            >
              중복확인
            </CheckButton>
          }
        />
        <Input
          autoComplete="new-password"
          errorText={hasPasswordError ? PASSWORD_HELPER_TEXT : undefined}
          helperText={PASSWORD_HELPER_TEXT}
          label="비밀번호"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          autoComplete="new-password"
          errorText={
            hasPasswordConfirmError ? '비밀번호가 일치하지 않아요' : undefined
          }
          label="비밀번호 재확인"
          type="password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />
      </Fields>
    </BottomSheet>
  );
};

const Fields = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: `${theme.spacing['2xl']} ${theme.spacing['2xl']} ${theme.spacing['3xl']}`,
}));

const CheckButton = styled(Button)({
  flexShrink: 0,
  alignSelf: 'center',
});
