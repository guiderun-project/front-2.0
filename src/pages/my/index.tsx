import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { PageLayout, QueryBoundary, Text } from '@/components';
import { APP_PATH } from '@/router/path';

import { AccountMenu } from './components/AccountMenu';
import { MY_RUNNING_EDIT_PATH } from './edit/constants';
import { ActivitySummaryCard } from './components/ActivitySummaryCard';
import { ProfileInfoSection } from './components/ProfileInfoSection';
import { ProfileSummary } from './components/ProfileSummary';
import { RunningInfoSection } from './components/RunningInfoSection';
import { useMyPage } from './hooks/useMyPage';

const LOADING_MESSAGE = '마이페이지 정보를 불러오는 중이에요.';
const ERROR_MESSAGE = '마이페이지 정보를 불러오지 못했어요.';

export const MyPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <Header>
        <Text as="h1" color="text.primary" font="heading-m-sb">
          마이페이지
        </Text>
      </Header>

      <QueryBoundary errorMessage={ERROR_MESSAGE} loadingMessage={LOADING_MESSAGE}>
        <MyPageContent />
      </QueryBoundary>
    </PageLayout>
  );
};

const MyPageContent = (): ReactElement => {
  const navigate = useNavigate();
  const { data } = useMyPage();

  return (
    <>
      <ProfileSummary profile={data.profile} />

      <ActivitySection>
        <ActivitySummaryCard
          participation={data.participation}
          onViewActivity={() => navigate(APP_PATH.MY_EVENTS)}
        />
      </ActivitySection>

      <InfoSection>
        <ProfileInfoSection
          personalInfo={data.personalInfo}
          onEdit={() => navigate(APP_PATH.MY_EDIT)}
          onInputBirthDate={() => navigate(APP_PATH.MY_EDIT)}
        />
        <RunningInfoSection
          runningInfo={data.runningInfo}
          onEdit={() => navigate(MY_RUNNING_EDIT_PATH)}
        />
        <AccountMenu />
      </InfoSection>
    </>
  );
};

const Header = styled.header(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
}));

const ActivitySection = styled.div(({ theme }) => ({
  paddingInline: theme.spacing['2xl'],
}));

const InfoSection = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  paddingTop: theme.spacing['3xl'],
  paddingBottom: theme.spacing.lg,
  paddingInline: theme.spacing['2xl'],
}));
