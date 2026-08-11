import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react';

import styled from '@emotion/styled';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { ANALYTICS_EVENT, getApiErrorMessage, trackEvent } from '@/api/core';
import { api } from '@/api/services';
import {
  ConfirmPopup,
  FooterButton,
  HiddenText,
  PageLayout,
  TopNavigation,
} from '@/components';
import { useAuth } from '@/contexts';
import { useRouteBlockerConfirm } from '@/hooks/useRouteBlockerConfirm';
import { APP_PATH } from '@/router/path';
import { clearReturnPath } from '@/router/returnPath';

import { Stepper } from '@/pages/signup/components/Stepper';
import { BasicInfoStep } from '@/pages/signup/components/steps/BasicInfoStep';
import { CompleteStep } from '@/pages/signup/components/steps/CompleteStep';
import { ExperienceStep } from '@/pages/signup/components/steps/ExperienceStep';
import { GenderStep } from '@/pages/signup/components/steps/GenderStep';
import { RecordStep } from '@/pages/signup/components/steps/RecordStep';
import { RunnerTypeStep } from '@/pages/signup/components/steps/RunnerTypeStep';
import { TermsStep } from '@/pages/signup/components/steps/TermsStep';
import {
  SIGNUP_FIELD,
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
    mode: 'onChange',
  });
  const [
    selectedRunnerType,
    selectedGender,
    selectedHasExperience,
    agreements,
  ] = useWatch({
    control: methods.control,
    name: [
      SIGNUP_FIELD.DISABILITY_TYPE,
      SIGNUP_FIELD.GENDER,
      SIGNUP_FIELD.HAS_EXPERIENCE,
      SIGNUP_FIELD.AGREEMENTS,
    ],
  });

  const signupToken =
    (location.state as SignupLocationState | null)?.signupToken ??
    (import.meta.env.DEV ? DEV_FALLBACK_SIGNUP_TOKEN : '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  // 가입 성공 시 발급된 accessToken. /signup 은 guest-only 라 제출 직후 startSession 하면
  // 완료 화면이 뜨기 전에 가드가 HOME 으로 보낸다. 토큰만 보관하고 세션 시작은 완료 화면에서 한다.
  const [issuedAccessToken, setIssuedAccessToken] = useState<string | null>(
    null,
  );

  const { step, isFirst, goNext, goPrev } = funnel;
  const stepperStage = SIGNUP_STEP_STAGE[step];
  const isCompleteStep = step === 'complete';
  const isTermsStep = step === 'terms';

  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const exitResolverRef = useRef<((v: boolean) => void) | null>(null);

  const handleExitConfirm = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        exitResolverRef.current = resolve;
        setIsExitConfirmOpen(true);
      }),
    [],
  );

  useRouteBlockerConfirm({
    enabled: !isCompleteStep,
    onConfirm: handleExitConfirm,
  });

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
    navigate(isCompleteStep ? APP_PATH.HOME : APP_PATH.INTRO);

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
      window.alert('가입 정보가 만료되었어요. 처음부터 다시 시도해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.auth.signupPost({
        signupToken,
        body: toSignupRequest(values),
      });
      setIssuedAccessToken(response.accessToken);
      trackEvent(ANALYTICS_EVENT.SIGNUP_COMPLETED, {
        disabilityType: values.disabilityType,
      });
      goNext();
    } catch (error) {
      window.alert(
        getApiErrorMessage(
          error,
          '회원가입에 실패했어요. 잠시 후 다시 시도해주세요.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleClickFooterButton = async () => {
    if (isCompleteStep) {
      clearReturnPath();

      if (issuedAccessToken) {
        await startSession(issuedAccessToken);
      }
      navigate(APP_PATH.HOME);
      return;
    }

    if (isTermsStep) {
      await submitSignup();
      return;
    }

    // 현재 단계의 필드만 검증하고, 통과해야 다음 단계로 이동한다.
    const isStepValid = await methods.trigger(SIGNUP_STEP_FIELDS[step]);
    if (isStepValid) {
      goNext();
      return;
    }

    // 검증 실패: 첫 오류 필드로 포커스를 옮겨 해당 필드의 오류가 describedby로
    // 낭독되게 한다. 이 포커스 낭독이 단일 채널이므로 별도의 폼 수준 안내는 두지
    // 않는다. (Input 오류 미러도 포커스가 막 도착한 오류의 주입을 생략한다.)
    // 오류 상태가 DOM에 반영된 다음 프레임에 포커스를 옮긴다.
    window.requestAnimationFrame(() => {
      const firstInvalidField = SIGNUP_STEP_FIELDS[step].find(
        (name) => methods.getFieldState(name).invalid,
      );
      if (!firstInvalidField) return;
      methods.setFocus(firstInvalidField);
      // TimeInput(10KM 러닝기록)처럼 RHF ref가 연결되지 않는 필드는 setFocus가
      // 무시되므로, 오류 표시된 첫 input으로 보조 포커스를 옮긴다.
      if (!stepAreaRef.current?.contains(document.activeElement)) {
        stepAreaRef.current
          ?.querySelector<HTMLElement>('input[aria-invalid="true"]')
          ?.focus();
      }
    });
  };

  const primaryLabel = isCompleteStep
    ? '서비스 둘러보기'
    : isTermsStep
      ? '신청완료'
      : '다음';
  const isFooterButtonDisabled =
    isSubmitting ||
    (step === 'runnerType' && selectedRunnerType === null) ||
    (step === 'gender' && selectedGender === null) ||
    (step === 'experience' && selectedHasExperience === null) ||
    (isTermsStep &&
      (!agreements.privacy ||
        !agreements.portraitRights ||
        !agreements.trainingSafety));

  return (
    <PageLayout background="bg.default">
      <FormProvider {...methods}>
        <TopNavigation
          aria-label="회원가입 내비게이션"
          left={
            isCompleteStep
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

        <ConfirmPopup
          cancelText="아니요"
          confirmText="네, 그만할게요"
          description="지금까지 입력한 정보는 저장되지 않아요."
          open={isExitConfirmOpen}
          title="가입을 그만할까요?"
          onCancel={() => {
            exitResolverRef.current?.(false);
            setIsExitConfirmOpen(false);
          }}
          onConfirm={() => {
            exitResolverRef.current?.(true);
            setIsExitConfirmOpen(false);
          }}
          onOpenChange={setIsExitConfirmOpen}
        />

        <FooterButton>
          <FooterButton.Button
            aria-busy={isSubmitting}
            disabled={isFooterButtonDisabled}
            fullWidth
            size="l"
            type="button"
            onClick={handleClickFooterButton}
          >
            {primaryLabel}
          </FooterButton.Button>
        </FooterButton>

        {/* 제출 진행 안내용 SR 전용 라이브 리전. 상시 마운트해 두고 내용만 바꾼다. */}
        <HiddenText role="status">
          {isSubmitting ? '가입 신청 중이에요' : ''}
        </HiddenText>
      </FormProvider>
    </PageLayout>
  );
};

// 포커스 대상 h1을 감싸기 위한 래퍼. 레이아웃에는 영향을 주지 않도록 박스를 만들지 않는다.
const StepArea = styled.div({
  display: 'contents',
});
