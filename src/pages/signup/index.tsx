import { useEffect, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { api } from '@/api/services';
import { FooterButton, PageLayout, Text, TopNavigation } from '@/components';
import { useAuth } from '@/contexts';
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
  SIGNUP_STEP_FIELDS,
  SIGNUP_STEP_STAGE,
} from '@/pages/signup/constants';
import { useSignupFunnel } from '@/pages/signup/hooks/useSignupFunnel';
import { signupSchema } from '@/pages/signup/schema';
import type { SignupFormValues, SignupStepId } from '@/pages/signup/types';
import { toSignupRequest } from '@/pages/signup/utils';

// 카카오 OAuth SIGNUP_REQUIRED 응답에서 전달받는 router state
type SignupLocationState = {
  signupToken?: string;
};

// 개발 환경에서 OAuth 없이 /signup 진입 시 사용하는 mock 토큰 (mocks/handlers/authHandlers 와 일치)
const DEV_FALLBACK_SIGNUP_TOKEN = 'mock-signup-token';

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
  const location = useLocation();
  const { startSession } = useAuth();
  const funnel = useSignupFunnel();
  const methods = useForm<SignupFormValues>({
    defaultValues: SIGNUP_FORM_DEFAULT_VALUES,
    resolver: zodResolver(signupSchema),
  });

  const signupToken =
    (location.state as SignupLocationState | null)?.signupToken ??
    (import.meta.env.DEV ? DEV_FALLBACK_SIGNUP_TOKEN : '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  // 약관 동의까지 마치면 폼 값을 가입 요청 형태로 변환해 제출하고, 성공 시 세션을 시작한 뒤 완료 화면으로 전환한다.
  const submitSignup = methods.handleSubmit(async (values) => {
    if (!signupToken) {
      setSubmitError('가입 정보가 만료되었어요. 처음부터 다시 시도해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.auth.signupPost({
        signupToken,
        body: toSignupRequest(values),
      });
      await startSession(response.accessToken);
      goNext();
    } catch {
      setSubmitError('회원가입에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handlePrimary = async () => {
    if (isComplete) {
      navigate(APP_PATH.HOME);
      return;
    }

    if (isTerms) {
      await submitSignup();
      return;
    }

    // 현재 단계의 필드만 검증하고, 통과해야 다음 단계로 이동한다.
    const isStepValid = await methods.trigger(SIGNUP_STEP_FIELDS[step]);
    if (isStepValid) {
      goNext();
    }
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

        {submitError ? (
          <SubmitError color="text.danger" font="body-s-m" role="alert">
            {submitError}
          </SubmitError>
        ) : null}

        <FooterButton>
          <FooterButton.Button
            disabled={isSubmitting}
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

// 제출 실패 안내. 고정 푸터 위 본문 흐름에 배치하고 가로 여백만 맞춘다.
const SubmitError = styled(Text)(({ theme }) => ({
  padding: `${theme.spacing.none} ${theme.spacing['2xl']}`,
}));
