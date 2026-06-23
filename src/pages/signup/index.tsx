import { useEffect, useRef, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { FooterButton, PageLayout, TopNavigation } from '@/components';
import { APP_PATH } from '@/router/path';

import { Stepper } from '@/pages/signup/components/Stepper';
import { BasicInfoStep } from '@/pages/signup/components/steps/BasicInfoStep';
import { CompleteStep } from '@/pages/signup/components/steps/CompleteStep';
import { ExperienceStep } from '@/pages/signup/components/steps/ExperienceStep';
import { GenderStep } from '@/pages/signup/components/steps/GenderStep';
import { RecordStep } from '@/pages/signup/components/steps/RecordStep';
import { RunnerTypeStep } from '@/pages/signup/components/steps/RunnerTypeStep';
import { TermsStep } from '@/pages/signup/components/steps/TermsStep';
import {
  SIGNUP_FORM_DEFAULT_VALUES,
  SIGNUP_STEPPER_LABELS,
  SIGNUP_STEP_STAGE,
} from '@/pages/signup/constants';
import { useSignupFunnel } from '@/pages/signup/hooks/useSignupFunnel';
import type { SignupFormValues, SignupStepId } from '@/pages/signup/types';

const renderStep = (step: SignupStepId): ReactElement => {
  switch (step) {
    case 'runnerType':
      return <RunnerTypeStep />;
    case 'gender':
      return <GenderStep />;
    case 'basicInfo':
      return <BasicInfoStep />;
    case 'experience':
      return <ExperienceStep />;
    case 'record':
      return <RecordStep />;
    case 'terms':
      return <TermsStep />;
    case 'complete':
      return <CompleteStep />;
  }
};

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

  const stepAreaRef = useRef<HTMLDivElement>(null);

  // 단계 전환 시 새 화면의 제목(h1)으로 포커스를 옮겨, 직전 버튼에 남은 포커스를 이동시키고
  // 키보드·스크린리더 사용자에게 단계 변경을 알린다.
  useEffect(() => {
    const heading = stepAreaRef.current?.querySelector<HTMLElement>('h1');
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }, [step]);

  const handleClose = () =>
    navigate(isComplete ? APP_PATH.HOME : APP_PATH.INTRO);

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

  const primaryLabel = isComplete
    ? '서비스 둘러보기'
    : isTerms
      ? '신청완료'
      : '다음';

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
            {
              icon: 'close-lined',
              ariaLabel: '회원가입 닫기',
              onClick: handleClose,
            },
          ]}
        />

        {stepperStage !== null ? (
          <Stepper current={stepperStage} steps={SIGNUP_STEPPER_LABELS} />
        ) : null}

        <StepArea ref={stepAreaRef}>{renderStep(step)}</StepArea>

        <FooterButton>
          <FooterButton.Button
            fullWidth
            size="l"
            type="button"
            onClick={handlePrimary}
          >
            {primaryLabel}
          </FooterButton.Button>
        </FooterButton>
      </FormProvider>
    </PageLayout>
  );
};

// 포커스 대상 h1을 감싸기 위한 래퍼. 레이아웃에는 영향을 주지 않도록 박스를 만들지 않는다.
const StepArea = styled.div({
  display: 'contents',
});
