import { useEffect, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MyActivityPartnerSort } from '@/api/types';
import { Pagination } from '@/components';

import { EmptyPartners } from './EmptyPartners';
import { PartnerItem } from './PartnerItem';
import { useMyActivityPartners } from './useMyActivityPartners';

const FIRST_PAGE = 1;

type MyActivityPartnersResultProps = {
  page: number;
  sort: MyActivityPartnerSort;
  onLoaded?: (totalCount: number) => void;
  onPageChange: (page: number) => void;
};

export const MyActivityPartnersResult = ({
  onLoaded,
  onPageChange,
  page,
  sort,
}: MyActivityPartnersResultProps): ReactElement => {
  const { data } = useMyActivityPartners({ sort, page });
  const { totalPages } = data.pagination;
  const shouldClampPage = totalPages > 0 && page > totalPages;

  useEffect(() => {
    if (shouldClampPage) {
      onPageChange(FIRST_PAGE);
    }
  }, [onPageChange, shouldClampPage]);

  // 정렬 변경 등으로 새 데이터가 로드되면 상위의 SR 안내 리전에 알린다.
  useEffect(() => {
    onLoaded?.(data.pagination.totalCount);
  }, [data, onLoaded]);

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
