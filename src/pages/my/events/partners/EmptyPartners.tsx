import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon, Text } from '@/components';

export const EmptyPartners = (): ReactElement => (
  <EmptyState role="status">
    <Icon
      aria-hidden={true}
      color="icon.tertiary"
      icon="alert-circle-filled"
      size={64}
    />
    <Text align="center" as="p" color="text.tertiary" font="heading-s-m">
      아직 함께 달린 파트너가
      <br />
      없어요
    </Text>
  </EmptyState>
);

const EmptyState = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing['2xl'],
  minHeight: theme.pxToRem(515),
  boxSizing: 'border-box',
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.pxToRem(150)}`,
}));
