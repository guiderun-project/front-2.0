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
import { ACCOUNT_FIND_TYPE } from '@/constants';
import { onlyDigits } from '@/pages/account-find/utils';
import { APP_PATH } from '@/router/path';

const FIND_ID_PHASE = {
  VERIFY: 'verify',
  FOUND: 'found',
  NOT_FOUND: 'notFound',
} as const;

type FindIdPhase = (typeof FIND_ID_PHASE)[keyof typeof FIND_ID_PHASE];

const TITLE_VERIFY = '아이디를 찾기 위해\n번호 인증이 필요해요';
const TITLE_FOUND = '아래 아이디로\n로그인해주세요';

// TODO: 실제 SMS 인증 타이머로 대체. 현재는 퍼블리싱용 정적 표기.
const PLACEHOLDER_TIMER = '03:00';

// TODO: accountIdPost 결과로 found/notFound 분기. 현재는 퍼블리싱 미리보기용 트리거.
const NO_ACCOUNT_SENTINEL = '0000';

export const FindId = (): ReactElement => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<FindIdPhase>(FIND_ID_PHASE.VERIFY);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [phoneNum, setPhoneNum] = useState('');
  const [certCode, setCertCode] = useState('');

  const certInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCodeSent) {
      certInputRef.current?.focus();
    }
  }, [isCodeSent]);

  const handleBack = () => {
    if (phase !== FIND_ID_PHASE.VERIFY) {
      setPhase(FIND_ID_PHASE.VERIFY);
      return;
    }
    navigate(-1);
  };

  // TODO: accountIdVerificationIssuePost 호출로 대체
  const handleSendCode = () => {
    setIsCodeSent(true);
    // 재발송 시 이전 입력 초기화
    setCertCode('');
    // 이미 노출된 경우 즉시 포커스, 최초 노출은 아래 effect가 처리
    certInputRef.current?.focus();
  };

  // TODO: smsVerificationExtendPost 호출 + 타이머 3:00 재시작
  const handleExtendTime = () => {};

  const handleNext = () => {
    setPhase(
      certCode === NO_ACCOUNT_SENTINEL
        ? FIND_ID_PHASE.NOT_FOUND
        : FIND_ID_PHASE.FOUND,
    );
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
              confirmDisabled={phoneNum.trim() === ''}
              confirmLabel="확인"
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
                onChange={(event) => setCertCode(onlyDigits(event.target.value))}
                onConfirm={handleExtendTime}
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
            <NotFoundIllustration aria-hidden={true} />
          </NotFoundContainer>
        )}

        {phase === FIND_ID_PHASE.VERIFY && (
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

const NotFoundIllustration = styled.div(({ theme }) => ({
  width: theme.pxToRem(102),
  height: theme.pxToRem(102),
  borderRadius: theme.radius.full,
  // TODO: 일러스트 변경 예정
  backgroundColor: 'rgba(169, 173, 181, 0.2)',
}));
