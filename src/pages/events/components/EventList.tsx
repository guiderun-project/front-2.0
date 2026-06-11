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
  Icon,
  PageLayout,
  Pagination,
  Tabs,
  Text,
  type SelectOptions,
} from "@/components";

import { useEventList } from "../hooks/useEventList";
import { EventListCard } from "./EventListCard";

const SEARCH_PLACEHOLDER = "관심있는 모임을 찾아보세요";

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
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [tab, setTab] = useState<EventListTab>(EVENT_LIST_TABS.UPCOMING);
  const [typeFilter, setTypeFilter] = useState<EventListTypeFilter>(
    EVENT_LIST_TYPE_FILTERS.TOTAL,
  );
  const [recruitFilter, setRecruitFilter] = useState<RecruitStatusFilter>(
    RECRUIT_STATUS_FILTERS.ALL,
  );
  const [page, setPage] = useState(1);

  const trimmedKeyword = keyword.trim();
  const isUpcoming = tab === EVENT_LIST_TABS.UPCOMING;
  const isKeywordSearch = isSearching && trimmedKeyword !== "";

  const { data, isError, isPending } = useEventList({
    tab: isSearching ? EVENT_LIST_TABS.UPCOMING : tab,
    type:
      !isSearching && isUpcoming ? typeFilter : EVENT_LIST_TYPE_FILTERS.TOTAL,
    recruitStatus:
      !isSearching && isUpcoming ? recruitFilter : RECRUIT_STATUS_FILTERS.ALL,
    keyword: isSearching ? trimmedKeyword : "",
    page,
  });

  const items = data?.items ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;
  const totalPages = data?.pagination.totalPages ?? 0;

  const handleTabChange = (key: Key) => {
    if (key === EVENT_LIST_TABS.UPCOMING || key === EVENT_LIST_TABS.PAST) {
      setTab(key);
      setPage(1);
    }
  };

  const closeSearch = () => {
    setIsSearching(false);
    setKeyword("");
    setPage(1);
  };

  const listView = (
    <>
      <List>
        {items.map((event) => (
          <EventListCard event={event} key={event.id} />
        ))}
      </List>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </>
  );

  if (isSearching) {
    return (
      <PageLayout background="bg.subtle">
        <SearchHeader role="search">
          <SearchField>
            <Icon
              aria-hidden={true}
              color="icon.secondary"
              icon="search-lined"
              size={20}
            />
            <SearchInput
              aria-label="이벤트 검색"
              enterKeyHint="search"
              placeholder={SEARCH_PLACEHOLDER}
              type="search"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(1);
              }}
            />
          </SearchField>
          <CancelButton type="button" onClick={closeSearch}>
            취소
          </CancelButton>
        </SearchHeader>

        <Body>
          {isPending ? (
            <StateMessage>모임을 불러오는 중이에요.</StateMessage>
          ) : isError ? (
            <StateMessage>모임을 불러오지 못했어요.</StateMessage>
          ) : items.length === 0 ? (
            isKeywordSearch ? (
              <SearchEmpty>
                <Icon
                  aria-hidden={true}
                  color="icon.tertiary"
                  icon="alert-circle-filled"
                  size={48}
                />
                <Text color="text.tertiary" font="body-m-m">
                  검색 결과가 없어요
                </Text>
              </SearchEmpty>
            ) : (
              <StateMessage>표시할 모임이 없어요.</StateMessage>
            )
          ) : (
            listView
          )}
        </Body>
      </PageLayout>
    );
  }

  const browseResult = isPending ? (
    <StateMessage>모임을 불러오는 중이에요.</StateMessage>
  ) : isError ? (
    <StateMessage>모임을 불러오지 못했어요.</StateMessage>
  ) : items.length === 0 ? (
    <StateMessage>표시할 모임이 없어요.</StateMessage>
  ) : (
    <>
      <CountRow>
        <Text color="text.secondary" font="body-s-m">
          총 {totalCount}건
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
      {listView}
    </>
  );

  return (
    <PageLayout background="bg.subtle">
      <Header>
        <Text as="h1" color="text.primary" font="heading-m-sb">
          전체 모임
        </Text>
        <SearchEntry
          type="button"
          onClick={() => {
            setIsSearching(true);
            setPage(1);
          }}
        >
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
          <Tabs.Panel id={EVENT_LIST_TABS.UPCOMING}>
            <Body>{browseResult}</Body>
          </Tabs.Panel>
          <Tabs.Panel id={EVENT_LIST_TABS.PAST}>
            <Body>{browseResult}</Body>
          </Tabs.Panel>
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
}));

const SearchHeader = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  padding: `${theme.spacing.lg} ${theme.spacing["2xl"]}`,
}));

const SearchField = styled.div(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  alignItems: "center",
  gap: theme.spacing.md,
  minWidth: 0,
  padding: `${theme.spacing.md} ${theme.spacing.xl}`,
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.elevated,

  "&:focus-within": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const SearchInput = styled.input(({ theme }) => ({
  flex: "1 1 auto",
  minWidth: 0,
  border: "none",
  padding: 0,
  backgroundColor: "transparent",
  color: theme.color.text.primary,
  ...theme.typography["body-m-m"],

  "&::placeholder": {
    color: theme.color.text.tertiary,
  },

  "&:focus": {
    outline: "none",
  },
}));

const CancelButton = styled.button(({ theme }) => ({
  flexShrink: 0,
  border: 0,
  padding: 0,
  backgroundColor: "transparent",
  color: theme.color.text.secondary,
  cursor: "pointer",
  ...theme.typography["body-m-m"],

  "&:focus-visible": {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const SearchEntry = styled.button(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
  width: "100%",
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.elevated,
  cursor: "pointer",

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
  textAlign: "left",
  color: theme.color.text.tertiary,
  ...theme.typography["body-m-m"],
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

const SearchEmpty = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing.lg,
  minHeight: theme.pxToRem(240),
}));
