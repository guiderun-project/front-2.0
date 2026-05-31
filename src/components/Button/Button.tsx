import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon } from '@/components/Icon';
import {
  primitiveColorTokenMap,
  resolveColorToken,
  type ColorToken,
  type PrimitiveColorToken,
  type TypographyToken,
} from '@/styles/tokens';

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
  iconSize: number;
  radius: 'sm' | 'md';
  typography: TypographyToken;
};

type ButtonColorTokens = {
  background?: ButtonColorToken;
  border?: {
    color: ButtonColorToken;
    width: number;
  };
  content: ButtonColorToken;
  opacity?: number;
};

type ButtonColorToken = ColorToken | PrimitiveColorToken;

const isPrimitiveColorToken = (token: ButtonColorToken): token is PrimitiveColorToken => {
  return token in primitiveColorTokenMap;
};

const resolveButtonColorToken = (token: ButtonColorToken): string => {
  if (isPrimitiveColorToken(token)) {
    return primitiveColorTokenMap[token];
  }

  return resolveColorToken(token);
};

const BUTTON_SIZE_STYLES = {
  l: {
    width: 112,
    height: 54,
    paddingX: 'xl',
    gap: 'sm',
    iconSize: 16,
    radius: 'md',
    typography: 'body-l-b',
  },
  m: {
    width: 84,
    height: 42,
    paddingX: 'xl',
    gap: 'sm',
    iconSize: 16,
    radius: 'md',
    typography: 'body-m-sb',
  },
  s: {
    height: 32,
    minWidth: 56,
    paddingX: 'md',
    gap: 'sm',
    iconSize: 12,
    radius: 'sm',
    typography: 'body-s-sb',
  },
} as const satisfies Record<ButtonSize, ButtonSizeStyle>;

const BUTTON_COLOR_TOKENS: Record<ButtonLevel, Record<ButtonStatus, ButtonColorTokens>> = {
  primary: {
    default: {
      background: 'bg.brand',
      content: 'text.inverse',
    },
    selected: {
      // Figma defines Button selected/pressed colors with primitive cyan tokens.
      background: 'primitive.brand.cyan.600',
      content: 'text.inverse',
    },
    pressed: {
      background: 'primitive.brand.cyan.900',
      content: 'text.inverse',
    },
    disabled: {
      background: 'bg.brand',
      content: 'text.inverse',
      opacity: 0.32,
    },
  },
  secondary: {
    default: {
      background: 'bg.brand-soft',
      content: 'text.brand',
    },
    selected: {
      background: 'bg.brand-subtle',
      border: {
        color: 'text.brand',
        width: 2,
      },
      content: 'primitive.brand.cyan.600',
    },
    pressed: {
      background: 'bg.brand-subtle',
      content: 'primitive.brand.cyan.900',
    },
    disabled: {
      background: 'bg.surface',
      content: 'text.quaternary',
      opacity: 0.92,
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
      content: 'text.primary',
    },
    disabled: {
      background: 'bg.subtle',
      border: {
        color: 'border.subtle',
        width: 1.4,
      },
      content: 'text.quaternary',
      opacity: 0.92,
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
      content: 'text.primary',
    },
    disabled: {
      background: 'bg.overlay',
      border: {
        color: 'border.subtle',
        width: 1.4,
      },
      content: 'text.disabled',
      opacity: 0.92,
    },
  },
};

export const Button = ({
  'aria-pressed': ariaPressed,
  children,
  disabled,
  leftIcon = false,
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

  return (
    <StyledButton
      $level={level}
      $size={size}
      $status={resolvedStatus}
      aria-pressed={pressed}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {leftIcon ? <Icon aria-hidden={true} color={leftIconColor} icon={leftIconName} size={iconSize} /> : null}
      <ButtonLabel>{children}</ButtonLabel>
      {rightIcon ? <Icon aria-hidden={true} color={rightIconColor} icon={rightIconName} size={iconSize} /> : null}
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
      ? `${theme.pxToRem(defaultTokens.border.width)} solid ${resolveButtonColorToken(defaultTokens.border.color)}`
      : 0;
    const activeBorderStyle = pressedTokens.border
      ? `${theme.pxToRem(pressedTokens.border.width)} solid ${resolveButtonColorToken(pressedTokens.border.color)}`
      : 0;
    const disabledBorderStyle = disabledTokens.border
      ? `${theme.pxToRem(disabledTokens.border.width)} solid ${resolveButtonColorToken(disabledTokens.border.color)}`
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
      backgroundColor: defaultTokens.background ? resolveButtonColorToken(defaultTokens.background) : 'transparent',
      color: resolveButtonColorToken(defaultTokens.content),
      cursor: 'pointer',
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
      textAlign: 'center',
      textDecoration: 'none',
      touchAction: 'manipulation',
      opacity: defaultTokens.opacity,
      userSelect: 'none',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',

      '&:active:not(:disabled)': {
        border: activeBorderStyle,
        backgroundColor: pressedTokens.background ? resolveButtonColorToken(pressedTokens.background) : 'transparent',
        color: resolveButtonColorToken(pressedTokens.content),
        opacity: pressedTokens.opacity,
      },

      '&:focus-visible': {
        outline: `2px solid ${theme.color.border.focused}`,
        outlineOffset: theme.spacing.xs,
      },

      '&:disabled': {
        border: disabledBorderStyle,
        backgroundColor: disabledTokens.background ? resolveButtonColorToken(disabledTokens.background) : 'transparent',
        color: resolveButtonColorToken(disabledTokens.content),
        cursor: 'not-allowed',
        opacity: disabledTokens.opacity,
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
