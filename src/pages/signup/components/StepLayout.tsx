import type { ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

import { HiddenText, Text } from '@/components';

import { SIGNUP_STEPPER_LABELS } from '@/pages/signup/constants';

type StepLayoutProps = {
  title: ReactNode;
  /**
   * Stepper 기준 단계(1-based). 지정하면 h1 앞에 'N단계 중 M단계, '를
   * 스크린리더 전용 텍스트로 붙여, 단계 전환 시 h1 포커스 낭독에
   * 진행 위치가 함께 들리게 한다. 약관·완료 화면은 생략(null/미지정)한다.
   */
  stage?: number | null;
  children: ReactNode;
};

// 각 단계 화면의 공통 레이아웃: 좌측 정렬 제목 + 본문 영역.
export const StepLayout = ({
  title,
  stage,
  children,
}: StepLayoutProps): ReactElement => {
  return (
    <Wrapper>
      <Title as="h1" color="text.primary" font="heading-m-sb">
        {stage != null ? (
          <HiddenText>{`${SIGNUP_STEPPER_LABELS.length}단계 중 ${stage}단계, `}</HiddenText>
        ) : null}
        {title}
      </Title>
      <Content>{children}</Content>
    </Wrapper>
  );
};

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['4xl'],
  padding: `${theme.spacing.none} ${theme.spacing['2xl']}`,
}));

const Title = styled(Text)({
  whiteSpace: 'pre-line',
});

const Content = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
}));
