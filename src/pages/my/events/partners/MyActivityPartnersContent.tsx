import type { ReactElement, Ref } from 'react';

import styled from '@emotion/styled';

import type { MyActivityPartnerSort } from '@/api/types';
import { Filter, QueryBoundary, Text } from '@/components';

import {
  ERROR_MESSAGE,
  LOADING_MESSAGE,
  PARTNER_SORT_OPTIONS,
} from './constants';
import { MyActivityPartnersResult } from './MyActivityPartnersResult';

type MyActivityPartnersContentProps = {
  page: number;
  sectionRef?: Ref<HTMLElement>;
  sort: MyActivityPartnerSort;
  onPageChange: (page: number) => void;
  onSortChange: (sort: MyActivityPartnerSort) => void;
};

export const MyActivityPartnersContent = ({
  onPageChange,
  onSortChange,
  page,
  sectionRef,
  sort,
}: MyActivityPartnersContentProps): ReactElement => {
  return (
    <Section ref={sectionRef}>
      <SectionHeader>
        <Text as="h2" color="text.primary" font="heading-s-m">
          함께 달린 파트너
        </Text>
        <Filter
          icon="sort-lined"
          mode="cycle"
          options={PARTNER_SORT_OPTIONS}
          value={sort}
          onChange={onSortChange}
        />
      </SectionHeader>

      <QueryBoundary errorMessage={ERROR_MESSAGE} loadingMessage={LOADING_MESSAGE}>
        <MyActivityPartnersResult
          page={page}
          sort={sort}
          onPageChange={onPageChange}
        />
      </QueryBoundary>
    </Section>
  );
};

const Section = styled.section({
  display: 'flex',
  flexDirection: 'column',
});

const SectionHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing.xl,
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']} ${theme.spacing.none}`,

  '& > h2': {
    flex: '1 1 auto',
    minWidth: 0,
  },
}));
