import { useEffect, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MyActivityPartnerSort } from '@/api/types';
import { Pagination } from '@/components';

import { EmptyPartners } from './EmptyPartners';
import { PartnerItem } from './PartnerItem';
import { useMyActivityPartners } from './useMyActivityPartners';

type MyActivityPartnersResultProps = {
  page: number;
  sort: MyActivityPartnerSort;
  onPageChange: (page: number) => void;
};

export const MyActivityPartnersResult = ({
  onPageChange,
  page,
  sort,
}: MyActivityPartnersResultProps): ReactElement => {
  const { data } = useMyActivityPartners({ sort, page });
  const { totalPages } = data.pagination;
  const shouldClampPage = totalPages > 0 && page > totalPages;

  useEffect(() => {
    if (shouldClampPage) {
      onPageChange(totalPages);
    }
  }, [onPageChange, shouldClampPage, totalPages]);

  if (data.pagination.totalCount === 0) {
    return <EmptyPartners />;
  }

  if (shouldClampPage) {
    return <ResultBody />;
  }

  return (
    <ResultBody>
      <PartnerList>
        {data.items.map((partner) => (
          <PartnerItem key={partner.partnerId} partner={partner} />
        ))}
      </PartnerList>
      <PaginationWrap>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      </PaginationWrap>
    </ResultBody>
  );
};

const ResultBody = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xl,
  padding: `${theme.spacing['3xl']} ${theme.spacing['2xl']}`,
}));

const PartnerList = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xl,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const PaginationWrap = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing.lg,
}));
