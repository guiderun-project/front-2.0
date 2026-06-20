import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { PageLayout, Text } from '@/components';
import { APP_PATH } from '@/router/path';

import { AccountMenu } from './components/AccountMenu';
import { ActivitySummaryCard } from './components/ActivitySummaryCard';
import { ProfileInfoSection } from './components/ProfileInfoSection';
import { ProfileSummary } from './components/ProfileSummary';
import { RunningInfoSection } from './components/RunningInfoSection';

export const MyPage = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <PageLayout background="bg.subtle">
      <Header>
        <Text as="h1" color="text.primary" font="heading-m-sb">
          마이페이지
        </Text>
      </Header>

      <ProfileSummary />

      <ActivitySection>
        <ActivitySummaryCard
          onViewActivity={() => navigate(APP_PATH.MY_EVENTS)}
        />
      </ActivitySection>

      <InfoSection>
        <ProfileInfoSection onEdit={() => navigate(APP_PATH.MY_EDIT)} />
        <RunningInfoSection onEdit={() => navigate(APP_PATH.MY_EDIT)} />
        <AccountMenu />
      </InfoSection>
    </PageLayout>
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
