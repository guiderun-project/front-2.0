import { useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { ConfirmPopup, PageLayout, QueryBoundary, Text } from '@/components';
import { useAuth } from '@/contexts';
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
const INQUIRY_URL = 'https://open.kakao.com/o/sB89yqNf';

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
  const { logout } = useAuth();
  const { data } = useMyPage();
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleInquiry = () => {
    window.open(INQUIRY_URL, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      // 서버 로그아웃이 실패해도 로컬 세션은 정리되므로 인트로로 진행한다.
    } finally {
      navigate(APP_PATH.INTRO, { replace: true });
      setIsLoggingOut(false);
    }
  };

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
        <AccountMenu
          onInquiry={handleInquiry}
          onViewTerms={() => navigate(APP_PATH.TERMS)}
          onWithdraw={() => navigate(APP_PATH.ACCOUNT_DELETE)}
          onLogout={() => setIsLogoutPopupOpen(true)}
        />
      </InfoSection>

      <ConfirmPopup
        cancelText="아니요"
        confirmLoading={isLoggingOut}
        confirmText="로그아웃"
        open={isLogoutPopupOpen}
        title="지금 로그아웃 할까요?"
        onCancel={() => setIsLogoutPopupOpen(false)}
        onConfirm={handleLogout}
      />
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
