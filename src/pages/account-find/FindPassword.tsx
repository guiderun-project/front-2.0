import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/services';
import {
  FooterButton,
  FormPageLayout,
  Icon,
  Input,
  PageLayout,
  Text,
  TimerInput,
} from '@/components';
import { usePhoneCertification } from '@/pages/account-find/usePhoneCertification';
import {
  isValidNewPassword,
  NEW_PASSWORD_GUIDE,
} from '@/pages/account-find/utils';
import { APP_PATH } from '@/router/path';
import { isValidKoreanPhone, PHONE_DIGIT_LENGTH } from '@/utils';

const FIND_PASSWORD_PHASE = {
  VERIFY: 'verify',
  RESET: 'reset',
  DONE: 'done',
} as const;

type FindPasswordPhase =
  (typeof FIND_PASSWORD_PHASE)[keyof typeof FIND_PASSWORD_PHASE];

const TITLE_VERIFY = '비밀번호 재설정을 위해\n아래 정보를 입력해주세요';
const TITLE_RESET = '새롭게 사용할\n비밀번호를 입력해주세요';

const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 동일하지 않습니다.';
const VERIFY_ERROR_MESSAGE = '일치하는 계정 정보가 없습니다.';
const CERT_CODE_ERROR_MESSAGE = '인증번호가 올바르지 않습니다.';
const RESET_ERROR_MESSAGE = '비밀번호 변경에 실패했습니다.';

export const FindPassword = (): ReactElement => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<FindPasswordPhase>(
    FIND_PASSWORD_PHASE.VERIFY,
  );
  const [accountId, setAccountId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [certError, setCertError] = useState('');
  const [resetError, setResetError] = useState('');
  const {
    phoneNum,
    certCode,
    isCodeSent,
    verificationId,
    isExpired,
    canExtend,
    timerText,
    certInputRef,
    handlePhoneChange,
    handleCertCodeChange,
    sendCode,
    extendTime,
  } = usePhoneCertification();

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const newPasswordInvalid =
    newPassword.length > 0 && !isValidNewPassword(newPassword);
  const canSubmitPassword =
    isValidNewPassword(newPassword) && newPassword === confirmPassword;

  const handleBack = () => {
    if (phase !== FIND_PASSWORD_PHASE.VERIFY) {
      setPhase(FIND_PASSWORD_PHASE.VERIFY);
      return;
    }
    navigate(-1);
  };

  // 아이디·전화번호로 인증번호를 요청한다.
  const handleSendCode = async () => {
    if (
      accountId.trim() === '' ||
      !isValidKoreanPhone(phoneNum) ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    setVerifyError('');

    try {
      const response = await api.auth.passwordVerificationIssuePost({
        accountId,
        phoneNum,
      });
      sendCode(response);
    } catch {
      setVerifyError(VERIFY_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 인증번호를 검증하고 임시 토큰을 확보한 뒤 비밀번호 재설정 단계로 전환한다.
  const handleNext = async () => {
    if (certCode.trim() === '' || isSubmitting || verificationId === null) {
      return;
    }

    setIsSubmitting(true);
    setCertError('');

    try {
      const { token: issuedToken } =
        await api.auth.checkCertificationTokenPost({
          verificationId,
          number: certCode,
        });
      setToken(issuedToken);
      setPhase(FIND_PASSWORD_PHASE.RESET);
    } catch {
      setCertError(CERT_CODE_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 임시 토큰으로 새 비밀번호를 설정한다.
  const handleResetPassword = async () => {
    if (!canSubmitPassword || isSubmitting || token === '') {
      return;
    }

    setIsSubmitting(true);
    setResetError('');

    try {
      await api.auth.newPasswordPatch({ token, newPassword });
      setPhase(FIND_PASSWORD_PHASE.DONE);
    } catch {
      setResetError(RESET_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 인증 제한시간을 연장한다.
  const handleExtend = async () => {
    if (verificationId === null || !canExtend) {
      return;
    }

    try {
      const response = await api.auth.smsVerificationExtendPost({
        verificationId,
      });
      extendTime(response);
    } catch {
      // 연장 실패 시 기존 타이머를 유지한다.
    }
  };

  const resolveTitle = (): ReactNode => {
    if (phase === FIND_PASSWORD_PHASE.RESET) {
      return TITLE_RESET;
    }
    if (phase === FIND_PASSWORD_PHASE.DONE) {
      return (
        <DoneTitleBox>
          <Text as="span" color="text.secondary" font="body-m-m">
            비밀번호 변경 완료
          </Text>
          <Text as="span" color="text.primary" font="heading-m-sb">
            {'변경된 비밀번호로\n로그인을 해주세요'}
          </Text>
        </DoneTitleBox>
      );
    }
    return TITLE_VERIFY;
  };

  return (
    <PageLayout background="bg.default">
      <FormPageLayout
        topNavigation={{
          left: {
            icon: 'chevron-left-lined',
            ariaLabel: '이전 단계로 이동',
            onClick: handleBack,
          },
          right: [
            {
              icon: 'close-lined',
              ariaLabel: '닫기',
              onClick: () => navigate(APP_PATH.LOGIN),
            },
          ],
        }}
        title={resolveTitle()}
      >
        {phase === FIND_PASSWORD_PHASE.VERIFY && (
          <Container>
            <Input
              autoComplete="username"
              label="아이디"
              placeholder="아이디를 입력해주세요"
              value={accountId}
              onChange={(event) => {
                setVerifyError('');
                setAccountId(event.target.value);
              }}
            />
            <TimerInput
              autoComplete="tel"
              clearable={false}
              confirmDisabled={
                accountId.trim() === '' ||
                !isValidKoreanPhone(phoneNum) ||
                isSubmitting
              }
              confirmLabel="인증"
              error={Boolean(verifyError)}
              errorText={verifyError || undefined}
              inputMode="numeric"
              label="전화번호"
              maxLength={PHONE_DIGIT_LENGTH}
              placeholder="-없이 숫자만 입력해주세요"
              value={phoneNum}
              onChange={(event) => {
                setVerifyError('');
                handlePhoneChange(event);
              }}
              onConfirm={handleSendCode}
            />
            {isCodeSent && (
              <TimerInput
                autoComplete="one-time-code"
                confirmDisabled={!canExtend}
                confirmLabel="시간연장"
                confirmLevel="line-type"
                controlRef={certInputRef}
                error={Boolean(certError)}
                errorText={certError || undefined}
                inputMode="numeric"
                label="인증번호"
                timerText={timerText}
                value={certCode}
                onChange={(event) => {
                  setCertError('');
                  handleCertCodeChange(event);
                }}
                onConfirm={handleExtend}
              />
            )}
          </Container>
        )}

        {phase === FIND_PASSWORD_PHASE.RESET && (
          <Container>
            <Input
              autoComplete="new-password"
              error={newPasswordInvalid}
              errorText={newPasswordInvalid ? NEW_PASSWORD_GUIDE : undefined}
              helperText={newPasswordInvalid ? undefined : NEW_PASSWORD_GUIDE}
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <Input
              autoComplete="new-password"
              error={passwordMismatch || Boolean(resetError)}
              errorText={
                passwordMismatch
                  ? PASSWORD_MISMATCH_MESSAGE
                  : resetError || undefined
              }
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setResetError('');
                setConfirmPassword(event.target.value);
              }}
            />
          </Container>
        )}

        {phase === FIND_PASSWORD_PHASE.DONE && (
          <DoneContainer>
            <DoneIllustration>
              <Icon
                aria-hidden={true}
                color="icon.inverse"
                icon="check-thick-lined"
                size={56}
              />
            </DoneIllustration>
          </DoneContainer>
        )}

        {phase === FIND_PASSWORD_PHASE.VERIFY && (
          <FooterButton>
            <FooterButton.Button
              disabled={certCode.trim() === '' || isSubmitting || isExpired}
              fullWidth
              size="l"
              onClick={handleNext}
            >
              다음
            </FooterButton.Button>
          </FooterButton>
        )}

        {phase === FIND_PASSWORD_PHASE.RESET && (
          <FooterButton>
            <FooterButton.Button
              disabled={!canSubmitPassword || isSubmitting}
              fullWidth
              size="l"
              onClick={handleResetPassword}
            >
              다음
            </FooterButton.Button>
          </FooterButton>
        )}

        {phase === FIND_PASSWORD_PHASE.DONE && (
          <FooterButton>
            <FooterButton.Button
              fullWidth
              size="l"
              onClick={() => navigate(APP_PATH.LOGIN)}
            >
              로그인 하러가기
            </FooterButton.Button>
          </FooterButton>
        )}
      </FormPageLayout>
    </PageLayout>
  );
};

const Container = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing['2xl'],
}));

const DoneTitleBox = styled.span(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const DoneContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.pxToRem(40),
  paddingBottom: '3.5rem',
  paddingInline: theme.spacing['2xl'],
}));

const DoneIllustration = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.pxToRem(94),
  height: theme.pxToRem(94),
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg['brand-primary'],
}));
