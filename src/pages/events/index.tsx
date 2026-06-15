import { useState, useTransition, type Key, type ReactElement } from "react";

import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import { EVENT_LIST_TABS, EVENT_LIST_TYPE_FILTERS, RECRUIT_STATUS_FILTERS } from "@/api/constants/common";
import type {
  EventListTab,
  EventListTypeFilter,
  RecruitStatusFilter,
} from "@/api/types";
import { Icon, PageLayout, Tabs, Text } from "@/components";
import { APP_PATH } from "@/router/path";

import { EventBrowseResult } from "./components/EventBrowseResult";
import { EventsBoundary } from "./components/EventsBoundary";

const SEARCH_PLACEHOLDER = "관심있는 모임을 찾아보세요";

export const EventsPage = (): ReactElement => {
  const [tab, setTab] = useState<EventListTab>(EVENT_LIST_TABS.UPCOMING);
  const [typeFilter, setTypeFilter] = useState<EventListTypeFilter>(
    EVENT_LIST_TYPE_FILTERS.TOTAL,
  );
  const [recruitFilter, setRecruitFilter] = useState<RecruitStatusFilter>(
    RECRUIT_STATUS_FILTERS.ALL,
  );
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
      <EventsBoundary>
        <EventBrowseResult
          page={page}
          recruitFilter={recruitFilter}
          tab={tab}
          typeFilter={typeFilter}
          onPageChange={handlePageChange}
          onRecruitChange={handleRecruitChange}
          onTypeChange={handleTypeChange}
        />
      </EventsBoundary>
    </Body>
  );

  return (
    <PageLayout background="bg.default">
      <Header>
        <Text as="h1" color="text.primary" font="heading-m-sb">
          전체 모임
        </Text>
        <SearchEntry to={APP_PATH.EVENT_SEARCH}>
          <Icon
            aria-hidden={true}
            color="icon.secondary"
            icon="search-lined"
            size={20}
          />
          <SearchEntryText>{SEARCH_PLACEHOLDER}</SearchEntryText>
        </SearchEntry>
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

const SearchEntry = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  width: "100%",
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.elevated,
  boxSizing: "border-box",
  textDecoration: "none",

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const SearchEntryText = styled.span(({ theme }) => ({
  flex: "1 1 auto",
  minWidth: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: theme.color.text.tertiary,
  ...theme.typography["body-m-m"],
}));

const Body = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
}));
