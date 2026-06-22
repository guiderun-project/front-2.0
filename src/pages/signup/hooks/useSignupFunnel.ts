import { useCallback, useState } from 'react';

import { SIGNUP_STEP_IDS, type SignupStepId } from '../constants';

export type SignupFunnel = {
  step: SignupStepId;
  isFirst: boolean;
  goNext: () => void;
  goPrev: () => void;
};

// 화면 순서를 따라 앞/뒤로 이동하는 단계 머신. 순서는 선형이고, VI/GUIDE 분기는 각 화면 콘텐츠에서 처리한다.
export const useSignupFunnel = (): SignupFunnel => {
  const [stepIndex, setStepIndex] = useState(0);

  const goNext = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, SIGNUP_STEP_IDS.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    step: SIGNUP_STEP_IDS[stepIndex],
    isFirst: stepIndex === 0,
    goNext,
    goPrev,
  };
};
