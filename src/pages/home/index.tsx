import type { ReactElement } from "react";

import styled from "@emotion/styled";

import { PageLayout } from "@/components";
import { APPROVED_ROLES } from "@/constants";
import { useAuth } from "@/contexts";

import { ActivitySummary } from "./components/ActivitySummary";
import { HomeHeader } from "./components/HomeHeader";
import { HomeQuickActions } from "./components/HomeQuickActions";
import { HomeSearchBar } from "./components/HomeSearchBar";
import { HomeSectionBoundary } from "./components/HomeSectionBoundary";
import { HomeSectionMessage } from "./components/HomeSectionMessage";
import { UpcomingEventList } from "./components/UpcomingEventList";

const SUMMARY_LOADING_MESSAGE = "활동 요약을 불러오는 중입니다.";
const SUMMARY_ERROR_MESSAGE = "활동 요약을 불러오지 못했어요.";
const UPCOMING_LOADING_MESSAGE = "다가오는 모임을 불러오는 중입니다.";
const UPCOMING_ERROR_MESSAGE = "다가오는 모임을 불러오지 못했어요.";

export const MainPage = (): ReactElement => {
  const { isAuthReady, user } = useAuth();
  const isApproved = user ? APPROVED_ROLES.has(user.role) : false;

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
            {isApproved ? <HomeQuickActions /> : null}
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
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing["3xl"],
  paddingInline: theme.spacing["2xl"],
  paddingBottom: theme.spacing.md,
}));
