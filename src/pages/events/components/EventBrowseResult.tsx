import type { ReactElement } from "react";

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
import { Filter, Text, type SelectOptions } from "@/components";

import { useBrowseEvents } from "../hooks/useBrowseEvents";
import { EventResultList } from "./EventResultList";

const TYPE_FILTER_OPTIONS: SelectOptions<EventListTypeFilter> = [
  { label: "전체", value: EVENT_LIST_TYPE_FILTERS.TOTAL },
  { label: "대회", value: EVENT_LIST_TYPE_FILTERS.COMPETITION },
  { label: "훈련", value: EVENT_LIST_TYPE_FILTERS.TRAINING },
];

const RECRUIT_FILTER_OPTIONS: SelectOptions<RecruitStatusFilter> = [
  { label: "전체", value: RECRUIT_STATUS_FILTERS.ALL },
  { label: "모집중", value: RECRUIT_STATUS_FILTERS.OPEN },
  { label: "모집예정", value: RECRUIT_STATUS_FILTERS.UPCOMING },
  { label: "모집마감", value: RECRUIT_STATUS_FILTERS.CLOSE },
];

type EventBrowseResultProps = {
  tab: EventListTab;
  typeFilter: EventListTypeFilter;
  recruitFilter: RecruitStatusFilter;
  page: number;
  onTypeChange: (value: EventListTypeFilter) => void;
  onRecruitChange: (value: RecruitStatusFilter) => void;
  onPageChange: (page: number) => void;
};

export const EventBrowseResult = ({
  onPageChange,
  onRecruitChange,
  onTypeChange,
  page,
  recruitFilter,
  tab,
  typeFilter,
}: EventBrowseResultProps): ReactElement => {
  const isUpcoming = tab === EVENT_LIST_TABS.UPCOMING;
  const { data } = useBrowseEvents({
    tab,
    type: isUpcoming ? typeFilter : EVENT_LIST_TYPE_FILTERS.TOTAL,
    recruitStatus: isUpcoming ? recruitFilter : RECRUIT_STATUS_FILTERS.ALL,
    page,
  });

  const { items } = data;
  const { totalCount, totalPages } = data.pagination;

  return (
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
              onChange={onTypeChange}
            />
            <Filter
              ariaLabel="모집구분 필터"
              icon="chevron-down-lined"
              options={RECRUIT_FILTER_OPTIONS}
              placeholder="모집구분"
              sheetTitle="모집구분"
              value={recruitFilter}
              onChange={onRecruitChange}
            />
          </Filters>
        ) : null}
      </CountRow>

      {items.length === 0 ? (
        <EmptyMessage role="status">표시할 모임이 없어요.</EmptyMessage>
      ) : (
        <EventResultList
          items={items}
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

const CountRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Filters = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.spacing.sm,
}));

const EmptyMessage = styled.p(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  minHeight: theme.pxToRem(160),
  margin: 0,
  color: theme.color.text.tertiary,
  textAlign: "center",
  ...theme.typography["body-m-m"],
}));
