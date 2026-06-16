import type { ReactElement, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  FooterButton,
  FormPageLayout,
  PageLayout,
  Text,
  TimerInput,
} from '@/components';
import { APP_PATH } from '@/router/path';

type FindIdPhase = 'verify' | 'found' | 'notFound';

const TITLE_VERIFY = '아이디를 찾기 위해\n번호 인증이 필요해요';
const TITLE_FOUND = '아래 아이디로\n로그인해주세요';

// TODO: 실제 SMS 인증 타이머로 대체. 현재는 퍼블리싱용 정적 표기.
const PLACEHOLDER_TIMER = '03:00';

// TODO: accountIdPost 결과로 found/notFound 분기. 현재는 퍼블리싱 미리보기용 트리거.
const NO_ACCOUNT_SENTINEL = '0000';

export const FindId = (): ReactElement => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<FindIdPhase>('verify');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [phoneNum, setPhoneNum] = useState('');
  const [certCode, setCertCode] = useState('');

  const certInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isCodeSent) {
      certInputRef.current?.focus();
    }
  }, [isCodeSent]);

  // 인증 성공 후 활성화된 '다음' 버튼으로 포커스 이동
  useEffect(() => {
    if (isVerified) {
      submitButtonRef.current?.focus();
    }
  }, [isVerified]);

  const handleBack = () => {
    if (phase !== 'verify') {
      setPhase('verify');
      return;
    }
    navigate(-1);
  };

  // TODO: accountIdVerificationIssuePost 호출로 대체
  const handleSendCode = () => {
    setIsCodeSent(true);
    // 재발송 시 이전 인증 상태 초기화
    setCertCode('');
    setIsVerified(false);
    // 이미 노출된 경우 즉시 포커스, 최초 노출은 아래 effect가 처리
    certInputRef.current?.focus();
  };

  // TODO: checkCertificationTokenPost 정상 응답 시에만 인증 완료 처리
  const handleVerifyCode = () => {
    setIsVerified(true);
  };

  const handleNext = () => {
    setPhase(certCode === NO_ACCOUNT_SENTINEL ? 'notFound' : 'found');
  };

  const resolveTitle = (): ReactNode => {
    if (phase === 'found') {
      return TITLE_FOUND;
    }
    if (phase === 'notFound') {
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
        {phase === 'verify' && (
          <Container>
            <TimerInput
              autoComplete="tel"
              clearable={false}
              confirmDisabled={phoneNum.trim() === ''}
              confirmLabel="확인"
              inputMode="numeric"
              label="전화번호"
              placeholder="-없이 숫자만 입력해주세요"
              value={phoneNum}
              onChange={(event) =>
                setPhoneNum(event.target.value.replace(/[^0-9]/g, ''))
              }
              onConfirm={handleSendCode}
            />
            {isCodeSent && (
              <TimerInput
                autoComplete="one-time-code"
                confirmDisabled={certCode.trim() === '' || isVerified}
                confirmLabel="확인"
                controlRef={certInputRef}
                inputMode="numeric"
                label="인증번호"
                timerText={PLACEHOLDER_TIMER}
                value={certCode}
                onChange={(event) => {
                  setCertCode(event.target.value.replace(/[^0-9]/g, ''));
                  // 인증번호를 수정하면 이전 인증을 무효화 → 재확인 필요
                  setIsVerified(false);
                }}
                onConfirm={handleVerifyCode}
              />
            )}
          </Container>
        )}

        {phase === 'found' && (
          <Container>
            <InfoCard>
              <InfoRow>
                <InfoLabel as="span" color="text.tertiary" font="body-m-sb">
                  아이디
                </InfoLabel>
                <Text as="span" color="text.primary" font="body-m-m">
                  guiderun
                </Text>
              </InfoRow>
              <InfoRow>
                <InfoLabel as="span" color="text.tertiary" font="body-m-sb">
                  가입일
                </InfoLabel>
                <Text as="span" color="text.primary" font="body-m-m">
                  2026.01.01
                </Text>
              </InfoRow>
            </InfoCard>
            <ForgotPasswordButton
              type="button"
              onClick={() => navigate(`${APP_PATH.ACCOUNT_FIND}?type=password`)}
            >
              <Text as="span" color="text.brand" font="detail-m-sb">
                비밀번호를 잊었나요?
              </Text>
            </ForgotPasswordButton>
          </Container>
        )}

        {phase === 'notFound' && (
          <NotFoundContainer>
            <NotFoundIllustration aria-hidden={true} />
          </NotFoundContainer>
        )}

        {phase === 'verify' && (
          <FooterButton>
            <FooterButton.Button
              ref={submitButtonRef}
              disabled={!isVerified}
              fullWidth
              size="l"
              onClick={handleNext}
            >
              다음
            </FooterButton.Button>
          </FooterButton>
        )}

        {phase === 'found' && (
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

        {phase === 'notFound' && (
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

const NotFoundIllustration = styled.div(({ theme }) => ({
  width: theme.pxToRem(102),
  height: theme.pxToRem(102),
  borderRadius: theme.radius.full,
  // TODO: 일러스트 변경 예정
  backgroundColor: 'rgba(169, 173, 181, 0.2)',
}));
