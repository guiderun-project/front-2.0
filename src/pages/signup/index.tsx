import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { FooterButton, PageLayout, Text, TopNavigation } from '@/components';
import { APP_PATH } from '@/router/path';

import { Stepper } from './components/Stepper';
import {
  SIGNUP_FORM_DEFAULT_VALUES,
  SIGNUP_STEPPER_LABELS,
  SIGNUP_STEP_STAGE,
} from './constants';
import { useSignupFunnel } from './hooks/useSignupFunnel';
import type { SignupFormValues } from './types';

export const SignupPage = (): ReactElement => {
  const navigate = useNavigate();
  const funnel = useSignupFunnel();
  const methods = useForm<SignupFormValues>({
    defaultValues: SIGNUP_FORM_DEFAULT_VALUES,
  });

  const { step, isFirst, goNext, goPrev } = funnel;
  const stepperStage = SIGNUP_STEP_STAGE[step];
  const isComplete = step === 'complete';
  const isTerms = step === 'terms';

  const handleClose = () => navigate(isComplete ? APP_PATH.HOME : APP_PATH.INTRO);

  const handleBack = () => {
    if (isFirst) {
      navigate(-1);
      return;
    }
    goPrev();
  };

  // 약관 동의 후 가입 요청(API)은 추후 연결하고, 지금은 완료 화면으로 전환만 한다.
  const handlePrimary = () => {
    if (isComplete) {
      navigate(APP_PATH.HOME);
      return;
    }
    goNext();
  };

  const primaryLabel = isComplete ? '서비스 둘러보기' : isTerms ? '신청완료' : '다음';

  return (
    <PageLayout background="bg.default">
      <FormProvider {...methods}>
        <TopNavigation
          aria-label="회원가입 내비게이션"
          left={
            isComplete
              ? undefined
              : {
                  icon: 'chevron-left-lined',
                  ariaLabel: '이전 단계로 이동',
                  onClick: handleBack,
                }
          }
          right={[
            { icon: 'close-lined', ariaLabel: '회원가입 닫기', onClick: handleClose },
          ]}
        />

        {stepperStage !== null ? (
          <Stepper current={stepperStage} steps={SIGNUP_STEPPER_LABELS} />
        ) : null}

        <StepArea>
          {/* 단계별 입력 화면이 들어갈 자리. 지금은 단계 전환 동작 확인용 임시 화면이다. */}
          <Text as="h1" font="heading-m-sb">
            {step}
          </Text>
          <Text color="text.tertiary" font="body-s-r">
            단계 화면 준비 중 (PR2b)
          </Text>
        </StepArea>

        <FooterButton>
          <FooterButton.Button fullWidth size="l" type="button" onClick={handlePrimary}>
            {primaryLabel}
          </FooterButton.Button>
        </FooterButton>
      </FormProvider>
    </PageLayout>
  );
};

const StepArea = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing['2xl'],
}));
