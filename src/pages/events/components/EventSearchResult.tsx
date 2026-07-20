import type { ReactElement } from "react";

import styled from "@emotion/styled";

import {
  EVENT_LIST_TYPE_FILTERS,
  RECRUIT_STATUS_FILTERS,
} from "@/api/constants/common";
import type { EventListTypeFilter, RecruitStatusFilter } from "@/api/types";
import { Icon, Text } from "@/components";

import { useSearchEvents } from "../hooks/useSearchEvents";
import { EventResultHeader } from "./EventResultHeader";
import { EventResultList } from "./EventResultList";

type EventSearchResultProps = {
  keyword: string;
  typeFilter: EventListTypeFilter | undefined;
  recruitFilter: RecruitStatusFilter | undefined;
  page: number;
  onTypeChange: (value: EventListTypeFilter) => void;
  onRecruitChange: (value: RecruitStatusFilter) => void;
  onPageChange: (page: number) => void;
};

export const EventSearchResult = ({
  keyword,
  onPageChange,
  onRecruitChange,
  onTypeChange,
  page,
  recruitFilter,
  typeFilter,
}: EventSearchResultProps): ReactElement => {
  const { data } = useSearchEvents({
    keyword,
    type: typeFilter ?? EVENT_LIST_TYPE_FILTERS.TOTAL,
    recruitStatus: recruitFilter ?? RECRUIT_STATUS_FILTERS.ALL,
    page,
  });

  const { items } = data;
  const { totalCount, totalPages } = data.pagination;
  const isEmpty = items.length === 0;

  return (
    <>
      <EventResultHeader
        recruitFilter={recruitFilter}
        showFilters={true}
        srStatusMessage={isEmpty ? "검색 결과가 없어요" : `총 ${totalCount}건`}
        totalCount={totalCount}
        typeFilter={typeFilter}
        onRecruitChange={onRecruitChange}
        onTypeChange={onTypeChange}
      />
      {isEmpty ? (
        // 빈 상태 안내는 EventResultHeader 의 상시 마운트 status 리전이 담당한다.
        // 콘텐츠와 함께 새로 마운트되는 라이브 리전은 낭독이 보장되지 않는다.
        <SearchEmpty>
          <Icon
            aria-hidden={true}
            color="icon.tertiary"
            icon="alert-circle-filled"
            size={64}
          />
          <Text color="text.tertiary" font="body-m-m">
            검색 결과가 없어요
          </Text>
        </SearchEmpty>
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

const SearchEmpty = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing.lg,
  minHeight: theme.pxToRem(240),
}));
