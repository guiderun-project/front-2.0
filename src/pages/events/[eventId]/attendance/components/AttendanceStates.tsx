import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

import { Icon, Text } from '@/components';

type StateTextProps = Omit<
  ComponentPropsWithoutRef<'p'>,
  'align' | 'as' | 'color' | 'font'
>;

export const PanelState = (props: StateTextProps): ReactElement => {
  return (
    <PanelStateText
      align="center"
      as="p"
      color="text.tertiary"
      font="body-m-m"
      {...props}
    />
  );
};

export const SectionState = (props: StateTextProps): ReactElement => {
  return (
    <SectionStateText
      as="p"
      color="text.tertiary"
      font="body-m-m"
      {...props}
    />
  );
};

const PanelStateText = styled(Text)(({ theme }) => ({
  display: 'grid',
  minHeight: theme.pxToRem(160),
  placeItems: 'center',
}));

const SectionStateText = styled(Text)(({ theme }) => ({
  padding: `${theme.spacing.lg} ${theme.spacing.none}`,
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
        color="icon.tertiary"
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
