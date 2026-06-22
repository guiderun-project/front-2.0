import { useTransition, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';

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

const resolveType = (value: string | null): EventListTypeFilter =>
  value === EVENT_LIST_TYPE_FILTERS.COMPETITION ||
  value === EVENT_LIST_TYPE_FILTERS.TRAINING
    ? value
    : EVENT_LIST_TYPE_FILTERS.TOTAL;

const resolveRelation = (value: string | null): MyActivityEventRelationFilter =>
  value === MY_ACTIVITY_EVENT_RELATION_FILTERS.PARTICIPATED ||
  value === MY_ACTIVITY_EVENT_RELATION_FILTERS.HOSTED
    ? value
    : MY_ACTIVITY_EVENT_RELATION_FILTERS.TOTAL;

const resolvePage = (value: string | null): number => {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
};

export const MyRunningTab = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, startTransition] = useTransition();

  const typeParam = searchParams.get('type');
  const relationParam = searchParams.get('relation');
  const typeValue = typeParam === null ? undefined : resolveType(typeParam);
  const relationValue =
    relationParam === null ? undefined : resolveRelation(relationParam);
  const typeFilter = typeValue ?? EVENT_LIST_TYPE_FILTERS.TOTAL;
  const relationFilter = relationValue ?? MY_ACTIVITY_EVENT_RELATION_FILTERS.TOTAL;
  const page = resolvePage(searchParams.get('page'));

  const updateSearchParams = (mutate: (params: URLSearchParams) => void) => {
    startTransition(() => {
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous);
          params.set('tab', 'event');
          mutate(params);

          return params;
        },
        { replace: true },
      );
    });
  };

  const handleTypeChange = (value: EventListTypeFilter) => {
    updateSearchParams((params) => {
      params.set('type', value);
      params.delete('page');
    });
  };

  const handleRelationChange = (value: MyActivityEventRelationFilter) => {
    updateSearchParams((params) => {
      params.set('relation', value);
      params.delete('page');
    });
  };

  const handlePageChange = (next: number) => {
    updateSearchParams((params) => {
      if (next > 1) {
        params.set('page', String(next));
      } else {
        params.delete('page');
      }
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
            sheetTitle="유형 선택"
            value={typeValue}
            onChange={handleTypeChange}
          />
          <Filter
            ariaLabel="주최여부 필터"
            icon="chevron-down-lined"
            options={RELATION_FILTER_OPTIONS}
            placeholder="주최여부"
            sheetTitle="주최여부 선택"
            value={relationValue}
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
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']}`,
}));
