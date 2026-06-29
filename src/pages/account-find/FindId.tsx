import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/services';
import {
  FooterButton,
  FormPageLayout,
  Icon,
  PageLayout,
  Text,
  TimerInput,
} from '@/components';
import { ACCOUNT_FIND_TYPE } from '@/constants';
import { usePhoneCertification } from '@/pages/account-find/usePhoneCertification';
import { formatJoinDate } from '@/pages/account-find/utils';
import { APP_PATH } from '@/router/path';
import { isValidKoreanPhone, PHONE_DIGIT_LENGTH } from '@/utils';

const FIND_ID_PHASE = {
  VERIFY: 'verify',
  FOUND: 'found',
  NOT_FOUND: 'notFound',
} as const;

type FindIdPhase = (typeof FIND_ID_PHASE)[keyof typeof FIND_ID_PHASE];

const TITLE_VERIFY = '아이디를 찾기 위해\n번호 인증이 필요해요';
const TITLE_FOUND = '아래 아이디로\n로그인해주세요';

const SEND_CODE_ERROR_MESSAGE = '인증번호 발송에 실패했습니다.';
const CERT_CODE_ERROR_MESSAGE = '인증번호가 올바르지 않습니다.';

export const FindId = (): ReactElement => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<FindIdPhase>(FIND_ID_PHASE.VERIFY);
  const [accountId, setAccountId] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [certError, setCertError] = useState('');
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

  const handleBack = () => {
    if (phase !== FIND_ID_PHASE.VERIFY) {
      setPhase(FIND_ID_PHASE.VERIFY);
      return;
    }
    navigate(-1);
  };

  // 전화번호로 인증번호를 요청한다.
  const handleSendCode = async () => {
    if (!isValidKoreanPhone(phoneNum) || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setPhoneError('');

    try {
      const response = await api.auth.accountIdVerificationIssuePost({
        phoneNum,
      });
      sendCode(response);
    } catch {
      setPhoneError(SEND_CODE_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 인증번호를 검증하고 아이디 조회 결과로 단계를 전환한다.
  const handleNext = async () => {
    if (certCode.trim() === '' || isSubmitting || verificationId === null) {
      return;
    }

    setIsSubmitting(true);
    setCertError('');

    try {
      const { token } = await api.auth.checkCertificationTokenPost({
        verificationId,
        number: certCode,
      });

      try {
        const { accountId: foundId, createdAt } = await api.auth.accountIdPost({
          token,
        });
        setAccountId(foundId);
        setJoinDate(formatJoinDate(createdAt));
        setPhase(FIND_ID_PHASE.FOUND);
      } catch {
        // 인증은 성공했으나 일치하는 계정이 없는 경우다.
        setPhase(FIND_ID_PHASE.NOT_FOUND);
      }
    } catch {
      setCertError(CERT_CODE_ERROR_MESSAGE);
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
    if (phase === FIND_ID_PHASE.FOUND) {
      return TITLE_FOUND;
    }
    if (phase === FIND_ID_PHASE.NOT_FOUND) {
      return (
        <NotFoundTitleBox>
          <Text as="span" color="text.secondary" font="body-m-m">
            등록된 아이디가 없어요
          </Text>
          <Text as="span" color="text.primary" font="heading-m-sb">
            {'서비스 이용을 위해, 먼저\n카카오톡 회원가입이 필요해요'}
          </Text>
        </NotFoundTitleBox>
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
        {phase === FIND_ID_PHASE.VERIFY && (
          <Container>
            <TimerInput
              autoComplete="tel"
              clearable={false}
              confirmDisabled={!isValidKoreanPhone(phoneNum) || isSubmitting}
              confirmLabel="확인"
              error={Boolean(phoneError)}
              errorText={phoneError || undefined}
              inputMode="numeric"
              label="전화번호"
              maxLength={PHONE_DIGIT_LENGTH}
              placeholder="-없이 숫자만 입력해주세요"
              value={phoneNum}
              onChange={(event) => {
                setPhoneError('');
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

        {phase === FIND_ID_PHASE.FOUND && (
          <Container>
            <InfoCard>
              <InfoRow>
                <InfoLabel as="span" color="text.tertiary" font="body-m-sb">
                  아이디
                </InfoLabel>
                <Text as="span" color="text.primary" font="body-m-m">
                  {accountId}
                </Text>
              </InfoRow>
              <InfoRow>
                <InfoLabel as="span" color="text.tertiary" font="body-m-sb">
                  가입일
                </InfoLabel>
                <Text as="span" color="text.primary" font="body-m-m">
                  {joinDate}
                </Text>
              </InfoRow>
            </InfoCard>
            <ForgotPasswordButton
              type="button"
              onClick={() =>
                navigate(
                  `${APP_PATH.ACCOUNT_FIND}?type=${ACCOUNT_FIND_TYPE.PASSWORD}`,
                )
              }
            >
              <Text as="span" color="text.brand" font="detail-m-sb">
                비밀번호를 잊었나요?
              </Text>
            </ForgotPasswordButton>
          </Container>
        )}

        {phase === FIND_ID_PHASE.NOT_FOUND && (
          <NotFoundContainer>
            <Icon
              aria-hidden={true}
              color="icon.disabled"
              icon="alert-circle-filled"
              size={94}
            />
          </NotFoundContainer>
        )}

        {phase === FIND_ID_PHASE.VERIFY && (
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

        {phase === FIND_ID_PHASE.FOUND && (
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

        {phase === FIND_ID_PHASE.NOT_FOUND && (
          <FooterButton>
            <FooterButton.Button
              fullWidth
              size="l"
              onClick={() => navigate(APP_PATH.INTRO)}
            >
              카카오톡 계정으로 로그인
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
  gap: theme.spacing['2xl'],
  padding: theme.spacing['2xl'],
}));

const InfoCard = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['2xl'],
  padding: theme.spacing['2xl'],
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.bg.subtle,
}));

const InfoRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing['2xl'],
}));

const InfoLabel = styled(Text)(({ theme }) => ({
  flexShrink: 0,
  width: theme.pxToRem(80),
}));

const ForgotPasswordButton = styled.button(({ theme }) => ({
  alignSelf: 'center',
  appearance: 'none',
  border: 0,
  cursor: 'pointer',
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  borderRadius: '3.125rem',
  backgroundColor: theme.color.bg['brand-soft'],

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const NotFoundTitleBox = styled.span(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const NotFoundContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.pxToRem(40),
  paddingBottom: '3.5rem',
  paddingInline: theme.spacing['2xl'],
}));

