import type { ReactElement } from "react";

import styled from "@emotion/styled";

import {
  LoaderScreen,
  PageLayout,
  QueryBoundary,
  SearchEntry,
} from "@/components";
import { APPROVED_ROLES } from "@/constants";
import { useAuth } from "@/contexts";
import { APP_PATH } from "@/router/path";

import { ActivitySummary } from "@/pages/home/components/ActivitySummary";
import { HomeHeader } from "@/pages/home/components/HomeHeader";
import { HomeQuickActions } from "@/pages/home/components/HomeQuickActions";
import { UpcomingEventList } from "@/pages/home/components/UpcomingEventList";

const SUMMARY_LOADING_MESSAGE = "활동 요약을 불러오는 중이에요.";
const SUMMARY_ERROR_MESSAGE = "활동 요약을 불러오지 못했어요.";
const UPCOMING_LOADING_MESSAGE = "다가오는 모임을 불러오는 중이에요.";
const UPCOMING_ERROR_MESSAGE = "다가오는 모임을 불러오지 못했어요.";

export const MainPage = (): ReactElement => {
  const { isAuthReady, user } = useAuth();
  const isApproved = user ? APPROVED_ROLES.has(user.role) : false;

  if (!isAuthReady) {
    return (
      <PageLayout background="gradient.bg.brand-main">
        <LoaderScreen label="사용자 정보를 불러오는 중이에요." />
      </PageLayout>
    );
  }

  return (
    <PageLayout background="gradient.bg.brand-main">
      <HomeHeader />
      <Content>
        <SearchEntry to={APP_PATH.EVENT_SEARCH} />

        <QueryBoundary
          errorMessage={SUMMARY_ERROR_MESSAGE}
          loadingMessage={SUMMARY_LOADING_MESSAGE}
        >
          <ActivitySummary />
        </QueryBoundary>
        {isApproved ? <HomeQuickActions /> : null}
        <QueryBoundary
          errorMessage={UPCOMING_ERROR_MESSAGE}
          loadingMessage={UPCOMING_LOADING_MESSAGE}
        >
          <UpcomingEventList />
        </QueryBoundary>
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
