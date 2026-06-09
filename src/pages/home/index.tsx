import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { PageLayout } from '@/components';
import { useAuth } from '@/contexts';

import { ActivitySummary } from './components/ActivitySummary';
import { HomeHeader } from './components/HomeHeader';
import { HomeSearchBar } from './components/HomeSearchBar';
import { HomeSectionBoundary } from './components/HomeSectionBoundary';
import { HomeSectionMessage } from './components/HomeSectionMessage';
import { UpcomingEventList } from './components/UpcomingEventList';

const SUMMARY_LOADING_MESSAGE = '활동 요약을 불러오는 중입니다.';
const SUMMARY_ERROR_MESSAGE = '활동 요약을 불러오지 못했어요.';
const UPCOMING_LOADING_MESSAGE = '다가오는 모임을 불러오는 중입니다.';
const UPCOMING_ERROR_MESSAGE = '다가오는 모임을 불러오지 못했어요.';

export const MainPage = (): ReactElement => {
  const { isAuthReady } = useAuth();

  return (
    <PageLayout background="gradient.bg.brand-main">
      <HomeHeader />
      <Content>
        <HomeSearchBar />

        {isAuthReady ? (
          <>
            <HomeSectionBoundary
              errorMessage={SUMMARY_ERROR_MESSAGE}
              loadingMessage={SUMMARY_LOADING_MESSAGE}
            >
              <ActivitySummary />
            </HomeSectionBoundary>
            <HomeSectionBoundary
              errorMessage={UPCOMING_ERROR_MESSAGE}
              loadingMessage={UPCOMING_LOADING_MESSAGE}
            >
              <UpcomingEventList />
            </HomeSectionBoundary>
          </>
        ) : (
          <>
            <HomeSectionMessage role="status">
              {SUMMARY_LOADING_MESSAGE}
            </HomeSectionMessage>
            <HomeSectionMessage role="status">
              {UPCOMING_LOADING_MESSAGE}
            </HomeSectionMessage>
          </>
        )}
      </Content>
    </PageLayout>
  );
};

const Content = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['3xl'],
  paddingInline: theme.spacing['2xl'],
  // 하단 바텀 네비게이션과의 최소 간격
  paddingBottom: theme.spacing.md,
}));
