import type { ComponentPropsWithoutRef, ReactElement } from 'react';

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
      align="center"
      as="p"
      color="text.tertiary"
      font="body-m-m"
      {...props}
    />
  );
};

export const AllMatchedState = (): ReactElement => {
  return (
    <AllMatchedRoot>
      <AllMatchedIcon aria-hidden={true}>
        <Icon color="icon.tertiary" icon="check-lined" size={42} />
      </AllMatchedIcon>
      <Text align="center" as="p" color="text.tertiary" font="heading-s-m">
        모든 참여자가
        <br />
        매칭되었어요
      </Text>
    </AllMatchedRoot>
  );
};

const PanelStateText = styled(Text)(({ theme }) => ({
  display: 'grid',
  minHeight: theme.pxToRem(160),
  placeItems: 'center',
}));

const SectionStateText = styled(Text)(({ theme }) => ({
  padding: `${theme.spacing['5xl']} ${theme.spacing.none}`,
}));

const AllMatchedRoot = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing['2xl'],
  minHeight: theme.pxToRem(520),
  paddingBottom: theme.pxToRem(120),
  boxSizing: 'border-box',
}));

const AllMatchedIcon = styled.span(({ theme }) => ({
  display: 'grid',
  width: theme.pxToRem(64),
  height: theme.pxToRem(64),
  placeItems: 'center',
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.overlay,
}));
