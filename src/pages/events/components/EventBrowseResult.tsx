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
import { Text } from "@/components";

import { useBrowseEvents } from "../hooks/useBrowseEvents";
import { EventResultHeader } from "./EventResultHeader";
import { EventResultList } from "./EventResultList";

type EventBrowseResultProps = {
  tab: EventListTab;
  typeFilter: EventListTypeFilter | undefined;
  recruitFilter: RecruitStatusFilter | undefined;
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
    type: isUpcoming
      ? typeFilter ?? EVENT_LIST_TYPE_FILTERS.TOTAL
      : EVENT_LIST_TYPE_FILTERS.TOTAL,
    recruitStatus: isUpcoming
      ? recruitFilter ?? RECRUIT_STATUS_FILTERS.ALL
      : RECRUIT_STATUS_FILTERS.ALL,
    page,
  });

  const { items } = data;
  const { totalCount, totalPages } = data.pagination;
  const isEmpty = items.length === 0;

  return (
    <>
      <EventResultHeader
        recruitFilter={recruitFilter}
        showFilters={isUpcoming}
        srStatusMessage={isEmpty ? "표시할 모임이 없어요." : `총 ${totalCount}건`}
        totalCount={totalCount}
        typeFilter={typeFilter}
        onRecruitChange={onRecruitChange}
        onTypeChange={onTypeChange}
      />

      {isEmpty ? (
        // 빈 상태 안내는 EventResultHeader 의 상시 마운트 status 리전이 담당한다.
        // 콘텐츠와 함께 새로 마운트되는 라이브 리전은 낭독이 보장되지 않는다.
        <EmptyMessage
          align="center"
          as="p"
          color="text.tertiary"
          font="body-m-m"
        >
          표시할 모임이 없어요.
        </EmptyMessage>
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

const EmptyMessage = styled(Text)(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  minHeight: theme.pxToRem(160),
}));
