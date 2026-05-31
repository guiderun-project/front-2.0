import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { resolveColorToken, type ColorToken } from '@/styles/tokens';

import { Icon } from './Icon';
import type { IconName } from './iconRegistry';

const DEFAULT_ICON_BUTTON_ICON_SIZE = 20;
const DEFAULT_ICON_BUTTON_COLOR = 'icon.primary' satisfies ColorToken;
const DISABLED_ICON_BUTTON_COLOR = 'text.disabled' satisfies ColorToken;

export type IconButtonShape = 'square' | 'round';

type IconButtonStyleProps = {
  $background?: ColorToken;
  $buttonSize: number;
  $color: ColorToken;
  $shape: IconButtonShape;
};

type IconButtonProps = {
  icon: IconName;
  size?: number;
  iconSize?: number;
  color?: ColorToken;
  background?: ColorToken;
  shape?: IconButtonShape;
  'aria-label': string;
} & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'color'>;

export const IconButton = ({
  background,
  color = DEFAULT_ICON_BUTTON_COLOR,
  disabled,
  icon,
  iconSize,
  shape = 'square',
  size,
  type = 'button',
  ...props
}: IconButtonProps): ReactElement => {
  const resolvedIconSize = iconSize ?? DEFAULT_ICON_BUTTON_ICON_SIZE;
  const resolvedButtonSize = size ?? resolvedIconSize;
  const resolvedIconColor = disabled ? DISABLED_ICON_BUTTON_COLOR : color;

  return (
    <StyledIconButton
      $background={background}
      $buttonSize={resolvedButtonSize}
      $color={color}
      $shape={shape}
      disabled={disabled}
      type={type}
      {...props}
    >
      <Icon aria-hidden={true} color={resolvedIconColor} icon={icon} size={resolvedIconSize} />
    </StyledIconButton>
  );
};

const StyledIconButton = styled.button<IconButtonStyleProps>(
  ({ $background, $buttonSize, $color, $shape, theme }) => ({
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: $background ? resolveColorToken($background) : 'transparent',
    border: 0,
    borderRadius: $shape === 'round' ? theme.radius.full : theme.radius.sm,
    color: resolveColorToken($color),
    cursor: 'pointer',
    display: 'inline-grid',
    height: $buttonSize,
    justifyItems: 'center',
    padding: 0,
    placeItems: 'center',
    touchAction: 'manipulation',
    transition: 'background-color 120ms ease, opacity 120ms ease, transform 120ms ease',
    width: $buttonSize,

    '@media (hover: hover)': {
      '&:hover:not(:disabled)': {
        backgroundColor: $background ? resolveColorToken($background) : theme.color.bg.weak,
        opacity: $background ? 0.88 : 1,
      },
    },

    '&:active:not(:disabled)': {
      backgroundColor: $background ? resolveColorToken($background) : theme.color.bg.surface,
      opacity: $background ? 0.8 : 1,
      transform: 'scale(0.96)',
    },

    '&:focus-visible': {
      outline: `2px solid ${theme.color.border.focused}`,
      outlineOffset: theme.spacing.xs,
    },

    '&:disabled': {
      color: theme.color.text.disabled,
      cursor: 'not-allowed',
      opacity: 0.48,
    },

    '&:disabled:active': {
      transform: 'none',
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',

      '&:active:not(:disabled)': {
        transform: 'none',
      },
    },
  }),
);
