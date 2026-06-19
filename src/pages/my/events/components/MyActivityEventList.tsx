import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon, Pagination, Text } from '@/components';

import { useMyActivityEvents } from '../hooks/useMyActivityEvents';
import type { MyActivityEventsParams } from '../queryKeys';
import { MyActivityEventCard } from './MyActivityEventCard';

type MyActivityEventListProps = MyActivityEventsParams & {
  onPageChange: (page: number) => void;
};

export const MyActivityEventList = ({
  onPageChange,
  page,
  relation,
  type,
}: MyActivityEventListProps): ReactElement => {
  const { data } = useMyActivityEvents({ page, relation, type });
  const { items } = data;
  const { totalPages } = data.pagination;

  if (items.length === 0) {
    return (
      <Empty role="status">
        <Icon
          aria-hidden={true}
          color="icon.tertiary"
          icon="alert-circle-filled"
          size={64}
        />
        <Text color="text.tertiary" font="body-m-m">
          아직 러닝 기록이 없어요
        </Text>
      </Empty>
    );
  }

  return (
    <>
      <List>
        {items.map((event) => (
          <MyActivityEventCard event={event} key={event.id} />
        ))}
      </List>
      <PaginationWrap>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      </PaginationWrap>
    </>
  );
};

const Empty = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.lg,
  minHeight: theme.pxToRem(240),
}));

const List = styled.ul(({ theme }) => ({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.elevated,
  overflow: 'hidden',
}));

const PaginationWrap = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing['3xl'],
}));
