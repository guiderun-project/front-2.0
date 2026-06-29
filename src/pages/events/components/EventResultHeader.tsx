import type { ReactElement } from "react";

import styled from "@emotion/styled";

import {
  EVENT_LIST_TYPE_FILTERS,
  RECRUIT_STATUS_FILTERS,
} from "@/api/constants/common";
import type { EventListTypeFilter, RecruitStatusFilter } from "@/api/types";
import { Filter, Text, type SelectOptions } from "@/components";

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

type EventResultHeaderProps = {
  totalCount: number;
  showFilters: boolean;
  typeFilter: EventListTypeFilter | undefined;
  recruitFilter: RecruitStatusFilter | undefined;
  onTypeChange: (value: EventListTypeFilter) => void;
  onRecruitChange: (value: RecruitStatusFilter) => void;
};

export const EventResultHeader = ({
  onRecruitChange,
  onTypeChange,
  recruitFilter,
  showFilters,
  totalCount,
  typeFilter,
}: EventResultHeaderProps): ReactElement => {
  return (
    <CountRow>
      <Text color="text.secondary" font="body-s-m">
        총 {totalCount}건
      </Text>
      {showFilters ? (
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
