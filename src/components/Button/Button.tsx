import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { resolveColorToken } from '@/styles/tokens';

import { Icon } from '../Icon';
import { Text } from '../Text';
import { BUTTON_COLOR_TOKENS, BUTTON_ICON_SIZE, BUTTON_SIZE_STYLES } from './Button.constants';
import type { ButtonLevel, ButtonProps, ButtonSize, ButtonStatus } from './Button.types';

type ButtonStyleProps = {
  $fullWidth: boolean;
  $level: ButtonLevel;
  $size: ButtonSize;
  $status: ButtonStatus;
};

export const Button = ({
  children,
  disabled,
  fullWidth = false,
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
  const defaultIconColor = BUTTON_COLOR_TOKENS[level][resolvedStatus].content;
  const labelFont = BUTTON_SIZE_STYLES[size].typography;

  return (
    <StyledButton
      $fullWidth={fullWidth}
      $level={level}
      $size={size}
      $status={resolvedStatus}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {leftIcon ? (
        <IconSlot>
          <Icon
            {...leftIcon}
            aria-hidden={true}
            color={leftIcon.color ?? defaultIconColor}
            size={BUTTON_ICON_SIZE}
          />
        </IconSlot>
      ) : null}
      <ButtonLabel align="center" font={labelFont}>
        {children}
      </ButtonLabel>
      {rightIcon ? (
        <IconSlot>
          <Icon
            {...rightIcon}
            aria-hidden={true}
            color={rightIcon.color ?? defaultIconColor}
            size={BUTTON_ICON_SIZE}
          />
        </IconSlot>
      ) : null}
    </StyledButton>
  );
};

const StyledButton = styled.button<ButtonStyleProps>(
  ({ $fullWidth, $level, $size, $status, theme }) => {
    const sizeStyle = BUTTON_SIZE_STYLES[$size];
    const defaultTokens = BUTTON_COLOR_TOKENS[$level][$status];
    const pressedTokens = BUTTON_COLOR_TOKENS[$level].pressed;
    const disabledTokens = BUTTON_COLOR_TOKENS[$level].disabled;
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
    const pressedColorStyles = {
      border: activeBorderStyle,
      backgroundColor: pressedTokens.background ? resolveColorToken(pressedTokens.background) : 'transparent',
      color: resolveColorToken(pressedTokens.content),
    };

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: $fullWidth ? '100%' : width ? theme.pxToRem(width) : 'fit-content',
      minWidth: $fullWidth ? 0 : minWidth ? theme.pxToRem(minWidth) : undefined,
      height: theme.pxToRem(sizeStyle.height),
      padding: `0 ${theme.spacing[sizeStyle.paddingX]}`,
      gap: theme.spacing[sizeStyle.gap],
      appearance: 'none',
      border: borderStyle,
      borderRadius: theme.radius[sizeStyle.radius],
      boxSizing: 'border-box',
      backgroundColor: defaultTokens.background ? resolveColorToken(defaultTokens.background) : 'transparent',
      color: resolveColorToken(defaultTokens.content),
      cursor: 'pointer',
      textAlign: 'center',
      textDecoration: 'none',
      touchAction: 'manipulation',
      userSelect: 'none',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 120ms ease',

      '&:active:not(:disabled)': {
        ...pressedColorStyles,
        transform: 'scale(0.98)',
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

      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',

        '&:active:not(:disabled)': {
          transform: 'none',
        },
      },
    };
  },
);

const ButtonLabel = styled(Text)`
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
