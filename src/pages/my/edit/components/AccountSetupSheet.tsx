import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { BottomSheet, Button, HiddenText, Input } from '@/components';
import { useAnnouncedMessage } from '@/pages/my/hooks/useAnnouncedMessage';

import { useAccountSetup } from '../hooks/useAccountSetup';

const PASSWORD_HELPER_TEXT =
  '영문, 특수문자를 포함해 8자 이상 32자 미만 입력해주세요';

// 중복확인 결과는 helperText/errorText(aria-describedby)로만 렌더되어
// 포커스가 버튼에 있는 스크린리더 사용자에게 낭독되지 않으므로,
// 시트 내부 상시 마운트 라이브 리전으로 같은 문구를 안내한다.
const CHECK_RESULT_MESSAGES = {
  available: '사용 가능한 아이디예요',
  taken: '이미 사용 중인 아이디예요',
} as const;
const CHECK_FAILURE_MESSAGE = '중복 확인에 실패했어요. 다시 시도해주세요.';
const SUBMIT_FAILURE_MESSAGE = '아이디 설정에 실패했어요. 다시 시도해주세요.';

type Announcement = { message: string; revision: number };

const EMPTY_ANNOUNCEMENT: Announcement = { message: '', revision: 0 };

type AccountSetupSheetProps = {
  open: boolean;
  onClose: () => void;
  /** 아이디 설정 성공 시 시트가 닫히기 전에 호출된다. (성공 안내·포커스 복귀용) */
  onSetupSuccess: () => void;
  accountId?: string | null; // 이미 설정된 아이디. 아이디는 수정할 수 없다.
};

export const AccountSetupSheet = ({
  open,
  onClose,
  onSetupSuccess,
  accountId: existingAccountId,
}: AccountSetupSheetProps): ReactElement => {
  const {
    accountId,
    setAccountId,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    accountIdStatus,
    isAccountIdLocked,
    isCheckingAccountId,
    checkAccountIdDuplicate,
    hasPasswordError,
    hasPasswordConfirmError,
    canSubmit,
    submit,
    reset,
  } = useAccountSetup(existingAccountId);

  const [checkNotice, setCheckNotice] = useState(EMPTY_ANNOUNCEMENT);
  const [failureNotice, setFailureNotice] = useState(EMPTY_ANNOUNCEMENT);
  const announcedCheckNotice = useAnnouncedMessage(
    checkNotice.message,
    checkNotice.revision,
  );
  const announcedFailureNotice = useAnnouncedMessage(
    failureNotice.message,
    failureNotice.revision,
  );

  const handleClose = () => {
    onClose();
    reset();
    // 다음에 시트를 다시 열 때 이전 안내가 낭독되지 않도록 비운다.
    setCheckNotice((previous) => ({ message: '', revision: previous.revision + 1 }));
    setFailureNotice((previous) => ({ message: '', revision: previous.revision + 1 }));
  };

  const handleCheckAccountId = async () => {
    const result = await checkAccountIdDuplicate();

    if (result === null) {
      return;
    }

    if (result === 'error') {
      setFailureNotice((previous) => ({
        message: CHECK_FAILURE_MESSAGE,
        revision: previous.revision + 1,
      }));
      return;
    }

    setCheckNotice((previous) => ({
      message: CHECK_RESULT_MESSAGES[result],
      revision: previous.revision + 1,
    }));
  };

  const handleSubmit = async () => {
    const isSucceeded = await submit();

    if (isSucceeded) {
      onSetupSuccess();
      handleClose();
      return;
    }

    setFailureNotice((previous) => ({
      message: SUBMIT_FAILURE_MESSAGE,
      revision: previous.revision + 1,
    }));
  };

  return (
    <BottomSheet
      open={open}
      topBarTitle="아이디 설정"
      footer={
        <Button disabled={!canSubmit} fullWidth size="l" onClick={handleSubmit}>
          확인
        </Button>
      }
      onClose={handleClose}
    >
      <Fields>
        <Input
          autoComplete="username"
          errorText={
            accountIdStatus === 'taken'
              ? '이미 사용 중인 아이디예요'
              : undefined
          }
          helperText={
            accountIdStatus === 'available'
              ? '사용 가능한 아이디예요'
              : undefined
          }
          label="아이디"
          disabled={isAccountIdLocked}
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          trailing={
            <CheckButton
              disabled={
                isAccountIdLocked ||
                !accountId ||
                isCheckingAccountId ||
                accountIdStatus !== 'unchecked'
              }
              size="s"
              onClick={handleCheckAccountId}
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
        {/* 모달이 배경을 aria-hidden 처리하므로 라이브 리전은 시트 내부에 상시 마운트한다. */}
        <HiddenText role="status">{announcedCheckNotice}</HiddenText>
        <HiddenText role="alert">{announcedFailureNotice}</HiddenText>
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
