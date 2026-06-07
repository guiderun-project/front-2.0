import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

import { IconButton, type IconName } from '../Icon';
import { Text } from '../Text';

export type TopNavigationIconButtonProps = {
  icon: IconName;
  ariaLabel: string;
} & Omit<ComponentPropsWithoutRef<'button'>, 'aria-label' | 'children' | 'color'>;

type TopNavigationTitleTag = 'h1' | 'h2';

export type TopNavigationProps = {
  className?: string;
  left?: TopNavigationIconButtonProps;
  title?: ReactNode;
  titleAs?: TopNavigationTitleTag;
  right?: TopNavigationIconButtonProps[];
  'aria-label'?: string;
};

export const TopNavigation = ({
  'aria-label': ariaLabel = '상단 내비게이션',
  className,
  left,
  right,
  title,
  titleAs = 'h1',
}: TopNavigationProps): ReactElement => {
  const hasTitle = isRenderable(title);

  return (
    <Navigation aria-label={ariaLabel} className={className}>
      <NavigationBar>
        <LeftSlot>
          {left ? <TopNavigationIconButton {...left} /> : null}
        </LeftSlot>
        {hasTitle ? (
          <Title as={titleAs} color="text.primary" font="body-l-sb">
            {title}
          </Title>
        ) : (
          <TitleSpacer aria-hidden={true} />
        )}
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

const isRenderable = (value: ReactNode): boolean =>
  value !== undefined && value !== null && value !== false && value !== '';

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

const Title = styled(Text)({
  display: 'block',
  flex: '1 1 0',
  minWidth: 0,
  overflow: 'hidden',
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const TitleSpacer = styled.div({
  flex: '1 1 0',
  minWidth: 0,
});

const StyledIconButton = styled(IconButton)`
  flex: 0 0 auto;
`;
