import type { ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

import { Icon, Text } from '@/components';

export const PanelState = styled.p(({ theme }) => ({
  display: 'grid',
  minHeight: theme.pxToRem(160),
  placeItems: 'center',
  margin: 0,
  color: theme.color.text.tertiary,
  textAlign: 'center',
  ...theme.typography['body-m-m'],
}));

export const SectionState = styled.p(({ theme }) => ({
  margin: 0,
  padding: `${theme.spacing.lg} ${theme.spacing.none}`,
  color: theme.color.text.tertiary,
  ...theme.typography['body-m-m'],
}));

type SectionEmptyStateProps = {
  children: ReactNode;
};

export const SectionEmptyState = ({
  children,
}: SectionEmptyStateProps): ReactElement => {
  return (
    <SectionEmptyStateRoot>
      <Icon
        aria-hidden={true}
        color="icon.teritary"
        icon="alert-circle-filled"
        size={48}
      />
      <Text align="center" as="p" color="text.tertiary" font="body-m-m">
        {children}
      </Text>
    </SectionEmptyStateRoot>
  );
};

const SectionEmptyStateRoot = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.lg,
  width: '100%',
  padding: `${theme.spacing['5xl']} ${theme.spacing['2xl']}`,
  boxSizing: 'border-box',
}));
