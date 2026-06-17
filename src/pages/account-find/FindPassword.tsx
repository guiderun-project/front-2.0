import type { ReactElement, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  FooterButton,
  FormPageLayout,
  Input,
  PageLayout,
  Text,
  TimerInput,
} from '@/components';
import { APP_PATH } from '@/router/path';

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

// TODO: 실제 SMS 인증 타이머로 대체. 현재는 퍼블리싱용 정적 표기.
const PLACEHOLDER_TIMER = '03:00';

const onlyDigits = (value: string): string => value.replace(/[^0-9]/g, '');

export const FindPassword = (): ReactElement => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<FindPasswordPhase>(
    FIND_PASSWORD_PHASE.VERIFY,
  );
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [certCode, setCertCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const certInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCodeSent) {
      certInputRef.current?.focus();
    }
  }, [isCodeSent]);

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmitPassword =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleBack = () => {
    if (phase !== FIND_PASSWORD_PHASE.VERIFY) {
      setPhase(FIND_PASSWORD_PHASE.VERIFY);
      return;
    }
    navigate(-1);
  };

  // TODO: passwordVerificationIssuePost 호출로 대체
  const handleSendCode = () => {
    setIsCodeSent(true);
    // 재발송 시 이전 입력 초기화
    setCertCode('');
    // 이미 노출된 경우 즉시 포커스, 최초 노출은 아래 effect가 처리
    certInputRef.current?.focus();
  };

  // TODO: smsVerificationExtendPost 호출 + 타이머 3:00 재시작
  const handleExtendTime = () => {};

  // TODO: checkCertificationTokenPost 호출로 인증 토큰 확보 후 단계 전환
  const handleNext = () => {
    setPhase(FIND_PASSWORD_PHASE.RESET);
  };

  // TODO: newPasswordPatch 호출. 현재는 무조건 변경 완료로 전환.
  const handleResetPassword = () => {
    setPhase(FIND_PASSWORD_PHASE.DONE);
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
              onChange={(event) => setAccountId(event.target.value)}
            />
            <TimerInput
              autoComplete="tel"
              clearable={false}
              confirmDisabled={
                accountId.trim() === '' || phoneNum.trim() === ''
              }
              confirmLabel="인증"
              inputMode="numeric"
              label="전화번호"
              placeholder="-없이 숫자만 입력해주세요"
              value={phoneNum}
              onChange={(event) => setPhoneNum(onlyDigits(event.target.value))}
              onConfirm={handleSendCode}
            />
            {isCodeSent && (
              <TimerInput
                autoComplete="one-time-code"
                confirmLabel="시간연장"
                confirmLevel="line-type"
                controlRef={certInputRef}
                inputMode="numeric"
                label="인증번호"
                timerText={PLACEHOLDER_TIMER}
                value={certCode}
                onChange={(event) =>
                  setCertCode(onlyDigits(event.target.value))
                }
                onConfirm={handleExtendTime}
              />
            )}
          </Container>
        )}

        {phase === FIND_PASSWORD_PHASE.RESET && (
          <Container>
            <Input
              autoComplete="new-password"
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <Input
              autoComplete="new-password"
              error={passwordMismatch}
              errorText={
                passwordMismatch ? PASSWORD_MISMATCH_MESSAGE : undefined
              }
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </Container>
        )}

        {phase === FIND_PASSWORD_PHASE.DONE && (
          <DoneContainer>
            <DoneIllustration aria-hidden={true} />
          </DoneContainer>
        )}

        {phase === FIND_PASSWORD_PHASE.VERIFY && (
          <FooterButton>
            <FooterButton.Button
              disabled={certCode.trim() === ''}
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
              disabled={!canSubmitPassword}
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
  width: theme.pxToRem(102),
  height: theme.pxToRem(102),
  borderRadius: theme.radius.full,
  // TODO: 일러스트 변경 예정
  backgroundColor: 'rgba(169, 173, 181, 0.2)',
}));
