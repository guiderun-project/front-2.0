import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { resolveColorToken, type ColorToken, type TypographyToken } from '@/styles/tokens';

import type { ButtonLevel, ButtonProps, ButtonSize, ButtonStatus } from './Button.types';

type ButtonStyleProps = {
  $level: ButtonLevel;
  $size: ButtonSize;
  $status: ButtonStatus;
};

type ButtonSizeStyle = {
  width?: number;
  height: number;
  minWidth?: number;
  paddingX: 'md' | 'xl';
  gap: 'sm';
  radius: 'sm' | 'md';
  typography: TypographyToken;
};

type ButtonColorTokens = {
  background?: ColorToken;
  border?: {
    color: ColorToken;
    width: number;
  };
  content: ColorToken;
};

const BUTTON_SIZE_STYLES = {
  l: {
    width: 112,
    height: 54,
    paddingX: 'xl',
    gap: 'sm',
    radius: 'md',
    typography: 'body-l-b',
  },
  m: {
    width: 84,
    height: 42,
    paddingX: 'xl',
    gap: 'sm',
    radius: 'md',
    typography: 'body-m-sb',
  },
  s: {
    height: 32,
    minWidth: 56,
    paddingX: 'md',
    gap: 'sm',
    radius: 'sm',
    typography: 'body-s-sb',
  },
} as const satisfies Record<ButtonSize, ButtonSizeStyle>;

const BUTTON_COLOR_TOKENS: Record<ButtonLevel, Record<ButtonStatus, ButtonColorTokens>> = {
  primary: {
    default: {
      background: 'bg.brand-primary',
      content: 'text.inverse',
    },
    selected: {
      background: 'bg.brand-subtle',
      content: 'text.inverse',
    },
    pressed: {
      background: 'bg.brand-surface',
      content: 'text.inverse',
    },
    disabled: {
      background: 'bg.brand-soft2',
      content: 'text.inverse',
    },
  },
  secondary: {
    default: {
      background: 'bg.brand-soft',
      content: 'text.brand',
    },
    selected: {
      background: 'bg.brand-soft2',
      border: {
        color: 'text.brand',
        width: 2,
      },
      content: 'text.brand',
    },
    pressed: {
      background: 'bg.brand-soft2',
      content: 'text.brand-subtle',
    },
    disabled: {
      background: 'bg.surface',
      content: 'text.quaternary',
    },
  },
  'line-type': {
    default: {
      border: {
        color: 'border.default',
        width: 1.8,
      },
      content: 'text.secondary',
    },
    selected: {
      border: {
        color: 'text.brand',
        width: 2,
      },
      content: 'text.brand',
    },
    pressed: {
      background: 'bg.surface',
      border: {
        color: 'border.subtle',
        width: 2,
      },
      content: 'text.secondary',
    },
    disabled: {
      background: 'bg.subtle',
      border: {
        color: 'border.subtle',
        width: 1.4,
      },
      content: 'text.quaternary',
    },
  },
  quaternary: {
    default: {
      background: 'bg.overlay',
      content: 'text.secondary',
    },
    selected: {
      background: 'bg.overlay',
      border: {
        color: 'border.default',
        width: 2,
      },
      content: 'text.secondary',
    },
    pressed: {
      background: 'bg.overlay',
      border: {
        color: 'border.default',
        width: 2,
      },
      content: 'text.secondary',
    },
    disabled: {
      background: 'bg.overlay',
      border: {
        color: 'border.subtle',
        width: 1.4,
      },
      content: 'text.quaternary',
    },
  },
};

export const Button = ({
  children,
  disabled,
  leftIcon,
  level = 'primary',
  rightIcon,
  size = 'm',
  status = 'default',
  type = 'button',
  ...props
}: ButtonProps): ReactElement => {
  const resolvedStatus = disabled ? 'disabled' : status;
  const isDisabled = disabled || resolvedStatus === 'disabled';

  return (
    <StyledButton
      $level={level}
      $size={size}
      $status={resolvedStatus}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {leftIcon ? <IconSlot>{leftIcon}</IconSlot> : null}
      <ButtonLabel>{children}</ButtonLabel>
      {rightIcon ? <IconSlot>{rightIcon}</IconSlot> : null}
    </StyledButton>
  );
};

const StyledButton = styled.button<ButtonStyleProps>(
  ({ $level, $size, $status, theme }) => {
    const sizeStyle = BUTTON_SIZE_STYLES[$size];
    const defaultTokens = BUTTON_COLOR_TOKENS[$level][$status];
    const pressedTokens = BUTTON_COLOR_TOKENS[$level].pressed;
    const disabledTokens = BUTTON_COLOR_TOKENS[$level].disabled;
    const typography = theme.typography[sizeStyle.typography];
    const width = 'width' in sizeStyle ? sizeStyle.width : undefined;
    const minWidth = 'minWidth' in sizeStyle ? sizeStyle.minWidth : undefined;
    const borderStyle = defaultTokens.border
      ? `${theme.pxToRem(defaultTokens.border.width)} solid ${resolveColorToken(defaultTokens.border.color)}`
      : 0;
    const activeBorderStyle = pressedTokens.border
      ? `${theme.pxToRem(pressedTokens.border.width)} solid ${resolveColorToken(pressedTokens.border.color)}`
      : 0;
    const disabledBorderStyle = disabledTokens.border
      ? `${theme.pxToRem(disabledTokens.border.width)} solid ${resolveColorToken(disabledTokens.border.color)}`
      : 0;

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: width ? theme.pxToRem(width) : 'fit-content',
      minWidth: minWidth ? theme.pxToRem(minWidth) : undefined,
      height: theme.pxToRem(sizeStyle.height),
      padding: `0 ${theme.spacing[sizeStyle.paddingX]}`,
      gap: theme.spacing[sizeStyle.gap],
      appearance: 'none',
      border: borderStyle,
      borderRadius: theme.radius[sizeStyle.radius],
      backgroundColor: defaultTokens.background ? resolveColorToken(defaultTokens.background) : 'transparent',
      color: resolveColorToken(defaultTokens.content),
      cursor: 'pointer',
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
      textAlign: 'center',
      textDecoration: 'none',
      touchAction: 'manipulation',
      userSelect: 'none',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',

      '&:active:not(:disabled)': {
        border: activeBorderStyle,
        backgroundColor: pressedTokens.background ? resolveColorToken(pressedTokens.background) : 'transparent',
        color: resolveColorToken(pressedTokens.content),
      },

      '&:focus-visible': {
        outline: `2px solid ${theme.color.border.focused}`,
        outlineOffset: theme.spacing.xs,
      },

      '&:disabled': {
        border: disabledBorderStyle,
        backgroundColor: disabledTokens.background ? resolveColorToken(disabledTokens.background) : 'transparent',
        color: resolveColorToken(disabledTokens.content),
        cursor: 'not-allowed',
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

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`;
