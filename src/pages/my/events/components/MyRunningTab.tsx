import { useState, useTransition, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { EVENT_LIST_TYPE_FILTERS } from '@/api/constants/common';
import { MY_ACTIVITY_EVENT_RELATION_FILTERS } from '@/api/constants/user';
import type {
  EventListTypeFilter,
  MyActivityEventRelationFilter,
} from '@/api/types';
import { Filter, QueryBoundary, Text, type SelectOptions } from '@/components';

import { MyActivityEventList } from './MyActivityEventList';

const TYPE_FILTER_OPTIONS: SelectOptions<EventListTypeFilter> = [
  { label: '전체', value: EVENT_LIST_TYPE_FILTERS.TOTAL },
  { label: '대회', value: EVENT_LIST_TYPE_FILTERS.COMPETITION },
  { label: '훈련', value: EVENT_LIST_TYPE_FILTERS.TRAINING },
];

const RELATION_FILTER_OPTIONS: SelectOptions<MyActivityEventRelationFilter> = [
  { label: '전체', value: MY_ACTIVITY_EVENT_RELATION_FILTERS.TOTAL },
  { label: '참여한 러닝', value: MY_ACTIVITY_EVENT_RELATION_FILTERS.PARTICIPATED },
  { label: '만든러닝', value: MY_ACTIVITY_EVENT_RELATION_FILTERS.HOSTED },
];

const LOADING_MESSAGE = '러닝 기록을 불러오는 중이에요.';
const ERROR_MESSAGE = '러닝 기록을 불러오지 못했어요.';

export const MyRunningTab = (): ReactElement => {
  const [typeFilter, setTypeFilter] = useState<EventListTypeFilter>(
    EVENT_LIST_TYPE_FILTERS.TOTAL,
  );
  const [relationFilter, setRelationFilter] =
    useState<MyActivityEventRelationFilter>(
      MY_ACTIVITY_EVENT_RELATION_FILTERS.TOTAL,
    );
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  const handleTypeChange = (value: EventListTypeFilter) => {
    startTransition(() => {
      setTypeFilter(value);
      setPage(1);
    });
  };

  const handleRelationChange = (value: MyActivityEventRelationFilter) => {
    startTransition(() => {
      setRelationFilter(value);
      setPage(1);
    });
  };

  const handlePageChange = (next: number) => {
    startTransition(() => {
      setPage(next);
    });
  };

  return (
    <>
      <SectionHeader>
        <Text as="h2" color="text.primary" font="heading-s-m">
          나의 러닝
        </Text>
        <Filters>
          <Filter
            ariaLabel="유형 필터"
            icon="chevron-down-lined"
            options={TYPE_FILTER_OPTIONS}
            placeholder="유형"
            sheetTitle="유형"
            value={
              typeFilter === EVENT_LIST_TYPE_FILTERS.TOTAL
                ? undefined
                : typeFilter
            }
            onChange={handleTypeChange}
          />
          <Filter
            ariaLabel="주최여부 필터"
            icon="chevron-down-lined"
            options={RELATION_FILTER_OPTIONS}
            placeholder="주최여부"
            sheetTitle="주최여부"
            value={
              relationFilter === MY_ACTIVITY_EVENT_RELATION_FILTERS.TOTAL
                ? undefined
                : relationFilter
            }
            onChange={handleRelationChange}
          />
        </Filters>
      </SectionHeader>

      <ListSection>
        <QueryBoundary errorMessage={ERROR_MESSAGE} loadingMessage={LOADING_MESSAGE}>
          <MyActivityEventList
            page={page}
            relation={relationFilter}
            type={typeFilter}
            onPageChange={handlePageChange}
          />
        </QueryBoundary>
      </ListSection>
    </>
  );
};

const SectionHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.xl,
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']} ${theme.spacing.none}`,
}));

const Filters = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing.md,
}));

const ListSection = styled.div(({ theme }) => ({
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']}`,
}));
