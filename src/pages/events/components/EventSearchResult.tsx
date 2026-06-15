import type { ReactElement } from "react";

import styled from "@emotion/styled";

import type { EventListTypeFilter, RecruitStatusFilter } from "@/api/types";
import { Icon, Text } from "@/components";

import { useSearchEvents } from "../hooks/useSearchEvents";
import { EventResultHeader } from "./EventResultHeader";
import { EventResultList } from "./EventResultList";

type EventSearchResultProps = {
  keyword: string;
  typeFilter: EventListTypeFilter;
  recruitFilter: RecruitStatusFilter;
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
    type: typeFilter,
    recruitStatus: recruitFilter,
    page,
  });

  const { items } = data;
  const { totalCount, totalPages } = data.pagination;

  if (items.length === 0) {
    return (
      <SearchEmpty role="status">
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
    );
  }

  return (
    <>
      <EventResultHeader
        recruitFilter={recruitFilter}
        showFilters={true}
        totalCount={totalCount}
        typeFilter={typeFilter}
        onRecruitChange={onRecruitChange}
        onTypeChange={onTypeChange}
      />
      <EventResultList
        items={items}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
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
