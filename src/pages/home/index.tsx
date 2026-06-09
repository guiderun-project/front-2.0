import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { PageLayout, TopNavigation } from '@/components';

import { ActivitySummary } from './components/ActivitySummary';

export const MainPage = (): ReactElement => {
  return (
    <PageLayout background="gradient.bg.brand-main">
      <TopNavigation aria-label="홈 상단 메뉴" title="홈화면" />
      <Content>
        {/* C4: 이벤트 검색 진입 바 */}
        <ActivitySummary />
        {/* C3: 다가오는 러닝 모임 섹션 */}
      </Content>
    </PageLayout>
  );
};

const Content = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['3xl'],
  paddingInline: theme.spacing['2xl'],
}));
