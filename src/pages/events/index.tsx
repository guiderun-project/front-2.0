import { useState, useTransition, type Key, type ReactElement } from "react";

import styled from "@emotion/styled";

import { EVENT_LIST_TABS } from "@/api/constants/common";
import type {
  EventListTab,
  EventListTypeFilter,
  RecruitStatusFilter,
} from "@/api/types";
import { PageLayout, QueryBoundary, SearchEntry, Tabs, Text } from "@/components";
import { APP_PATH } from "@/router/path";

import { EventBrowseResult } from "./components/EventBrowseResult";

const LOADING_MESSAGE = "모임을 불러오는 중이에요.";
const ERROR_MESSAGE = "모임을 불러오지 못했어요.";

export const EventsPage = (): ReactElement => {
  const [tab, setTab] = useState<EventListTab>(EVENT_LIST_TABS.UPCOMING);
  const [typeFilter, setTypeFilter] = useState<EventListTypeFilter>();
  const [recruitFilter, setRecruitFilter] = useState<RecruitStatusFilter>();
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  const handleTabChange = (key: Key) => {
    if (key === EVENT_LIST_TABS.UPCOMING || key === EVENT_LIST_TABS.PAST) {
      startTransition(() => {
        setTab(key);
        setPage(1);
      });
    }
  };

  const handleTypeChange = (value: EventListTypeFilter) => {
    startTransition(() => {
      setTypeFilter(value);
      setPage(1);
    });
  };

  const handleRecruitChange = (value: RecruitStatusFilter) => {
    startTransition(() => {
      setRecruitFilter(value);
      setPage(1);
    });
  };

  const handlePageChange = (next: number) => {
    startTransition(() => {
      setPage(next);
    });
  };

  const result = (
    <Body>
      <QueryBoundary errorMessage={ERROR_MESSAGE} loadingMessage={LOADING_MESSAGE}>
        <EventBrowseResult
          page={page}
          recruitFilter={recruitFilter}
          tab={tab}
          typeFilter={typeFilter}
          onPageChange={handlePageChange}
          onRecruitChange={handleRecruitChange}
          onTypeChange={handleTypeChange}
        />
      </QueryBoundary>
    </Body>
  );

  return (
    <PageLayout background="bg.default">
      <Header>
        <Text as="h1" color="text.primary" font="heading-m-sb">
          전체 모임
        </Text>
        <SearchEntry to={APP_PATH.EVENT_SEARCH} />
      </Header>

      <Tabs selectedKey={tab} onSelectionChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab id={EVENT_LIST_TABS.UPCOMING}>예정 이벤트</Tabs.Tab>
          <Tabs.Tab id={EVENT_LIST_TABS.PAST}>지난 이벤트</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id={EVENT_LIST_TABS.UPCOMING}>{result}</Tabs.Panel>
          <Tabs.Panel id={EVENT_LIST_TABS.PAST}>{result}</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </PageLayout>
  );
};

const Header = styled.header(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
  backgroundColor: theme.color.bg.subtle,
}));

const Body = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
}));
