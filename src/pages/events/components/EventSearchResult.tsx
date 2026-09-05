import { useEffect, useRef, type ReactElement } from "react";

import styled from "@emotion/styled";

import {
  EVENT_LIST_TYPE_FILTERS,
  RECRUIT_STATUS_FILTERS,
} from "@/api/constants/common";
import { ANALYTICS_EVENT, trackEvent } from "@/api/core";
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
  const resolvedTypeFilter = typeFilter ?? EVENT_LIST_TYPE_FILTERS.TOTAL;
  const resolvedRecruitFilter =
    recruitFilter ?? RECRUIT_STATUS_FILTERS.ALL;
  const { data } = useSearchEvents({
    keyword,
    type: resolvedTypeFilter,
    recruitStatus: resolvedRecruitFilter,
    page,
  });

  const { items } = data;
  const { totalCount, totalPages } = data.pagination;
  const isEmpty = items.length === 0;
  const lastTrackedSearchRef = useRef<string | null>(null);

  useEffect(() => {
    const trackingKey = [
      keyword,
      page,
      resolvedRecruitFilter,
      resolvedTypeFilter,
      totalCount,
    ].join(":");

    if (lastTrackedSearchRef.current === trackingKey) {
      return;
    }

    lastTrackedSearchRef.current = trackingKey;
    trackEvent(ANALYTICS_EVENT.EVENT_SEARCH_RESULTS_VIEWED, {
      hasKeyword: keyword.trim().length > 0,
      keywordLength: keyword.trim().length,
      page,
      recruitStatus: resolvedRecruitFilter,
      resultCount: totalCount,
      type: resolvedTypeFilter,
    });
  }, [
    keyword,
    page,
    resolvedRecruitFilter,
    resolvedTypeFilter,
    totalCount,
  ]);

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
          source="search"
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
