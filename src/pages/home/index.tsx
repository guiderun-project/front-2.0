import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { PageLayout, TopNavigation } from '@/components';

import { ActivitySummary } from './components/ActivitySummary';
import { HomeSearchBar } from './components/HomeSearchBar';
import { UpcomingEventList } from './components/UpcomingEventList';

export const MainPage = (): ReactElement => {
  return (
    <PageLayout background="gradient.bg.brand-main">
      <TopNavigation aria-label="홈 상단 메뉴" title="홈화면" />
      <Content>
        <HomeSearchBar />
        <ActivitySummary />
        <UpcomingEventList />
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
