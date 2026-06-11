import { useState, type Key, type ReactElement } from "react";

import styled from "@emotion/styled";

import {
  EVENT_LIST_TABS,
  EVENT_LIST_TYPE_FILTERS,
  RECRUIT_STATUS_FILTERS,
} from "@/api/constants/common";
import type {
  EventListTab,
  EventListTypeFilter,
  RecruitStatusFilter,
} from "@/api/types";
import {
  Filter,
  PageLayout,
  Pagination,
  Tabs,
  Text,
  type SelectOptions,
} from "@/components";

import { useEventList } from "../hooks/useEventList";
import { EventListCard } from "./EventListCard";

const TYPE_FILTER_OPTIONS: SelectOptions<EventListTypeFilter> = [
  { label: "전체", value: EVENT_LIST_TYPE_FILTERS.TOTAL },
  { label: "대회", value: EVENT_LIST_TYPE_FILTERS.COMPETITION },
  { label: "훈련", value: EVENT_LIST_TYPE_FILTERS.TRAINING },
];

const RECRUIT_FILTER_OPTIONS: SelectOptions<RecruitStatusFilter> = [
  { label: "전체", value: RECRUIT_STATUS_FILTERS.ALL },
  { label: "모집예정", value: RECRUIT_STATUS_FILTERS.UPCOMING },
  { label: "모집중", value: RECRUIT_STATUS_FILTERS.OPEN },
  { label: "모집완료", value: RECRUIT_STATUS_FILTERS.CLOSE },
];

export const EventList = (): ReactElement => {
  const [tab, setTab] = useState<EventListTab>(EVENT_LIST_TABS.UPCOMING);
  const [typeFilter, setTypeFilter] = useState<EventListTypeFilter>(
    EVENT_LIST_TYPE_FILTERS.TOTAL,
  );
  const [recruitFilter, setRecruitFilter] = useState<RecruitStatusFilter>(
    RECRUIT_STATUS_FILTERS.ALL,
  );
  const [page, setPage] = useState(1);

  const isUpcoming = tab === EVENT_LIST_TABS.UPCOMING;
  const { data, isError, isPending } = useEventList({
    tab,
    type: isUpcoming ? typeFilter : EVENT_LIST_TYPE_FILTERS.TOTAL,
    recruitStatus: isUpcoming ? recruitFilter : RECRUIT_STATUS_FILTERS.ALL,
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
      <CountRow>
        <Text color="text.secondary" font="body-s-m">
          총 {data.pagination.totalCount}건
        </Text>
        {isUpcoming ? (
          <Filters>
            <Filter
              ariaLabel="유형 필터"
              icon="chevron-down-lined"
              options={TYPE_FILTER_OPTIONS}
              placeholder="유형"
              sheetTitle="유형"
              value={typeFilter}
              onChange={(value) => {
                setTypeFilter(value);
                setPage(1);
              }}
            />
            <Filter
              ariaLabel="모집구분 필터"
              icon="chevron-down-lined"
              options={RECRUIT_FILTER_OPTIONS}
              placeholder="모집구분"
              sheetTitle="모집구분"
              value={recruitFilter}
              onChange={(value) => {
                setRecruitFilter(value);
                setPage(1);
              }}
            />
          </Filters>
        ) : null}
      </CountRow>
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

const CountRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Filters = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.spacing.sm,
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
