import { useState, type Key, type ReactElement } from "react";

import styled from "@emotion/styled";

import {
  EVENT_LIST_TABS,
  EVENT_LIST_TYPE_FILTERS,
  RECRUIT_STATUS_FILTERS,
} from "@/api/constants/common";
import type { EventListTab } from "@/api/types";
import { PageLayout, Pagination, Tabs, Text } from "@/components";

import { useEventList } from "../hooks/useEventList";
import { EventListCard } from "./EventListCard";

export const EventList = (): ReactElement => {
  const [tab, setTab] = useState<EventListTab>(EVENT_LIST_TABS.UPCOMING);
  const [page, setPage] = useState(1);
  const { data, isError, isPending } = useEventList({
    tab,
    type: EVENT_LIST_TYPE_FILTERS.TOTAL,
    recruitStatus: RECRUIT_STATUS_FILTERS.ALL,
    keyword: "",
    page,
  });

  const handleTabChange = (key: Key) => {
    if (key === EVENT_LIST_TABS.UPCOMING || key === EVENT_LIST_TABS.PAST) {
      setTab(key);
      setPage(1);
    }
  };

  const result = isPending ? (
    <StateMessage>모임을 불러오는 중이에요.</StateMessage>
  ) : isError ? (
    <StateMessage>모임을 불러오지 못했어요.</StateMessage>
  ) : data.items.length === 0 ? (
    <StateMessage>표시할 모임이 없어요.</StateMessage>
  ) : (
    <>
      <Text color="text.secondary" font="body-s-m">
        총 {data.pagination.totalCount}건
      </Text>
      <List>
        {data.items.map((event) => (
          <EventListCard event={event} key={event.id} />
        ))}
      </List>
      <Pagination
        currentPage={page}
        totalPages={data.pagination.totalPages}
        onChange={setPage}
      />
    </>
  );

  return (
    <PageLayout background="bg.subtle">
      <Header>
        <Text as="h1" color="text.primary" font="heading-m-sb">
          전체 모임
        </Text>
      </Header>

      <Tabs selectedKey={tab} onSelectionChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab id={EVENT_LIST_TABS.UPCOMING}>예정 이벤트</Tabs.Tab>
          <Tabs.Tab id={EVENT_LIST_TABS.PAST}>지난 이벤트</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id={EVENT_LIST_TABS.UPCOMING}>
            <Body>{result}</Body>
          </Tabs.Panel>
          <Tabs.Panel id={EVENT_LIST_TABS.PAST}>
            <Body>{result}</Body>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </PageLayout>
  );
};

const Header = styled.header(({ theme }) => ({
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
}));

const Body = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.lg,
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
}));

const List = styled.ul({
  margin: 0,
  padding: 0,
});

const StateMessage = styled.p(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  minHeight: theme.pxToRem(160),
  margin: 0,
  color: theme.color.text.tertiary,
  textAlign: "center",
  ...theme.typography["body-m-m"],
}));
