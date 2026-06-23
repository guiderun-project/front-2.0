import type { ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

type StepLayoutProps = {
  title: ReactNode;
  children: ReactNode;
};

// 각 단계 화면의 공통 레이아웃: 좌측 정렬 제목 + 본문 영역.
export const StepLayout = ({ title, children }: StepLayoutProps): ReactElement => {
  return (
    <Wrapper>
      <Title as="h1" color="text.primary" font="heading-m-sb">
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
