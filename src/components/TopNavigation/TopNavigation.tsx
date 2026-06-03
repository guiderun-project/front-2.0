import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

import { IconButton, type IconName } from '../Icon';

export type TopNavigationIconButtonProps = {
  icon: IconName;
  ariaLabel: string;
} & Omit<ComponentPropsWithoutRef<'button'>, 'aria-label' | 'children' | 'color'>;

export type TopNavigationProps = {
  className?: string;
  left?: TopNavigationIconButtonProps;
  title: ReactNode;
  right?: TopNavigationIconButtonProps[];
  'aria-label'?: string;
};

export const TopNavigation = ({
  'aria-label': ariaLabel = '상단 내비게이션',
  className,
  left,
  right,
  title,
}: TopNavigationProps): ReactElement => {
  return (
    <Navigation aria-label={ariaLabel} className={className}>
      <NavigationBar>
        <LeftSlot>
          {left ? <TopNavigationIconButton {...left} /> : null}
        </LeftSlot>
        <Title>{title}</Title>
        <RightSlot>
          {right?.map((iconButton, index) => (
            <TopNavigationIconButton
              key={`${iconButton.icon}-${iconButton.ariaLabel}-${index}`}
              {...iconButton}
            />
          ))}
        </RightSlot>
      </NavigationBar>
    </Navigation>
  );
};

const TopNavigationIconButton = ({
  ariaLabel,
  icon,
  type = 'button',
  ...buttonProps
}: TopNavigationIconButtonProps): ReactElement => {
  return (
    <StyledIconButton
      aria-label={ariaLabel}
      icon={icon}
      iconSize={24}
      shape="square"
      size={24}
      type={type}
      {...buttonProps}
    />
  );
};

const Navigation = styled.nav`
  width: 100%;
`;

const NavigationBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing['2xl']}`};
`;

const LeftSlot = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-start;
  width: ${({ theme }) => theme.pxToRem(24)};
  height: ${({ theme }) => theme.pxToRem(24)};
`;

const RightSlot = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xl};
  min-height: ${({ theme }) => theme.pxToRem(24)};
`;

const Title = styled.span(({ theme }) => {
  const typography = theme.typography['body-l-sb'];

  return {
    display: 'block',
    flex: '1 1 0',
    minWidth: 0,
    margin: 0,
    overflow: 'hidden',
    color: theme.color.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    letterSpacing: 0,
    lineHeight: typography.lineHeight,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
});

const StyledIconButton = styled(IconButton)`
  flex: 0 0 auto;
`;
