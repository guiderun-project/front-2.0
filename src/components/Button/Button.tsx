import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon } from '@/components/Icon';
import { resolveColorToken } from '@/styles/tokens';

import type {
  ButtonColorTokens,
  ButtonLevel,
  ButtonProps,
  ButtonSize,
  ButtonSizeStyle,
  ButtonStatus,
  ButtonStyleProps,
} from './Button.types';

const BUTTON_SIZE_STYLES = {
  l: {
    height: '6xl',
    minWidth: 104,
    paddingX: '2xl',
    gap: 'sm',
    iconSize: 16,
    radius: 'sm',
    typography: 'body-s-sb',
  },
  m: {
    height: '5xl',
    minWidth: 80,
    paddingX: 'xl',
    gap: 'sm',
    iconSize: 16,
    radius: 'sm',
    typography: 'detail-m-sb',
  },
  s: {
    height: '4xl',
    minWidth: 56,
    paddingX: 'lg',
    gap: 'sm',
    iconSize: 12,
    radius: 's',
    typography: 'detail-s-sb',
  },
} as const satisfies Record<ButtonSize, ButtonSizeStyle>;

const BUTTON_COLOR_TOKENS = {
  primary: {
    default: {
      background: 'bg.brand',
      border: 'bg.brand',
      content: 'text.inverse',
    },
    selected: {
      background: 'bg.brand',
      border: 'bg.brand',
      content: 'text.inverse',
    },
    pressed: {
      background: 'bg.inverse',
      border: 'bg.inverse',
      content: 'text.inverse',
    },
    disabled: {
      background: 'bg.brand-soft',
      border: 'bg.brand-soft',
      content: 'text.quaternary',
    },
  },
  secondary: {
    default: {
      background: 'bg.brand-soft',
      border: 'bg.brand-soft',
      content: 'text.brand',
    },
    selected: {
      background: 'bg.brand-soft',
      border: 'border.brand',
      content: 'text.brand',
    },
    pressed: {
      background: 'bg.brand-subtle',
      border: 'bg.brand-subtle',
      content: 'text.primary',
    },
    disabled: {
      background: 'bg.subtle',
      border: 'bg.subtle',
      content: 'text.quaternary',
    },
  },
  'line-type': {
    default: {
      background: 'bg.surface',
      border: 'border.subtle',
      content: 'text.primary',
    },
    selected: {
      background: 'bg.surface',
      border: 'border.brand',
      content: 'text.brand',
    },
    pressed: {
      background: 'bg.subtle',
      border: 'border.subtle',
      content: 'text.primary',
    },
    disabled: {
      background: 'bg.subtle',
      border: 'border.subtle',
      content: 'text.quaternary',
    },
  },
  quaternary: {
    default: {
      background: 'bg.subtle',
      border: 'bg.subtle',
      content: 'text.primary',
    },
    selected: {
      background: 'bg.subtle',
      border: 'border.default',
      content: 'text.primary',
    },
    pressed: {
      background: 'bg.weak',
      border: 'bg.weak',
      content: 'text.primary',
    },
    disabled: {
      background: 'bg.subtle',
      border: 'bg.subtle',
      content: 'text.quaternary',
    },
  },
} as const satisfies Record<ButtonLevel, Record<ButtonStatus, ButtonColorTokens>>;

export const Button = ({
  'aria-pressed': ariaPressed,
  children,
  disabled,
  fullWidth = false,
  leftIcon,
  leftIconColor = 'currentColor',
  leftIconName = 'check-lined',
  level = 'primary',
  rightIcon = false,
  rightIconColor = 'currentColor',
  rightIconName = 'chevron-right-lined',
  size = 'm',
  status = 'default',
  type = 'button',
  ...props
}: ButtonProps): ReactElement => {
  const resolvedStatus = disabled ? 'disabled' : status;
  const isDisabled = disabled || resolvedStatus === 'disabled';
  const iconSize = BUTTON_SIZE_STYLES[size].iconSize;
  const pressed = ariaPressed ?? (resolvedStatus === 'selected' ? true : undefined);
  const hasLeftIcon = leftIcon ?? (resolvedStatus === 'selected');

  return (
    <StyledButton
      $fullWidth={fullWidth}
      $level={level}
      $size={size}
      $status={resolvedStatus}
      aria-pressed={pressed}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {hasLeftIcon ? <Icon aria-hidden={true} color={leftIconColor} icon={leftIconName} size={iconSize} /> : null}
      <ButtonLabel>{children}</ButtonLabel>
      {rightIcon ? <Icon aria-hidden={true} color={rightIconColor} icon={rightIconName} size={iconSize} /> : null}
    </StyledButton>
  );
};

const StyledButton = styled.button<ButtonStyleProps>(
  ({ $fullWidth, $level, $size, $status, theme }) => {
    const sizeStyle = BUTTON_SIZE_STYLES[$size];
    const defaultTokens = BUTTON_COLOR_TOKENS[$level][$status];
    const hoverTokens = BUTTON_COLOR_TOKENS[$level].selected;
    const pressedTokens = BUTTON_COLOR_TOKENS[$level].pressed;
    const disabledTokens = BUTTON_COLOR_TOKENS[$level].disabled;
    const typography = theme.typography[sizeStyle.typography];

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: $fullWidth ? '100%' : 'fit-content',
      minWidth: theme.pxToRem(sizeStyle.minWidth),
      height: theme.spacing[sizeStyle.height],
      padding: `0 ${theme.spacing[sizeStyle.paddingX]}`,
      gap: theme.spacing[sizeStyle.gap],
      appearance: 'none',
      border: `1px solid ${resolveColorToken(defaultTokens.border)}`,
      borderRadius: theme.radius[sizeStyle.radius],
      backgroundColor: resolveColorToken(defaultTokens.background),
      color: resolveColorToken(defaultTokens.content),
      cursor: 'pointer',
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.lineHeight,
      textAlign: 'center',
      textDecoration: 'none',
      touchAction: 'manipulation',
      transition:
        'background-color 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out, opacity 120ms ease-out, transform 80ms ease-out',
      userSelect: 'none',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',

      '@media (hover: hover)': {
        '&:hover:not(:disabled)': {
          borderColor: resolveColorToken($status === 'default' ? hoverTokens.border : defaultTokens.border),
          backgroundColor: resolveColorToken($status === 'default' ? hoverTokens.background : defaultTokens.background),
          color: resolveColorToken($status === 'default' ? hoverTokens.content : defaultTokens.content),
        },
      },

      '&:active:not(:disabled)': {
        borderColor: resolveColorToken(pressedTokens.border),
        backgroundColor: resolveColorToken(pressedTokens.background),
        color: resolveColorToken(pressedTokens.content),
        transform: 'scale(0.98)',
      },

      '&:focus-visible': {
        outline: `2px solid ${theme.color.border.focused}`,
        outlineOffset: theme.spacing.xs,
      },

      '&:disabled': {
        borderColor: resolveColorToken(disabledTokens.border),
        backgroundColor: resolveColorToken(disabledTokens.background),
        color: resolveColorToken(disabledTokens.content),
        cursor: 'not-allowed',
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
    };
  },
);

const ButtonLabel = styled.span`
  display: block;
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
`;
