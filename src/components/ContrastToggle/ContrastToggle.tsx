import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon } from '@/components/Icon';
import { useContrastMode } from '@/styles/useContrastMode';

type ContrastToggleProps = {
  disabled?: boolean;
  'aria-label'?: string;
} & Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-pressed' | 'children' | 'onClick' | 'type'
>;

export const ContrastToggle = ({
  'aria-label': ariaLabel = '고대비 모드',
  disabled = false,
  ...props
}: ContrastToggleProps): ReactElement => {
  const { contrastMode, setContrastMode } = useContrastMode();
  const isHighContrast = contrastMode === 'high';

  const handleToggleContrastMode = () => {
    if (disabled) {
      return;
    }

    setContrastMode(isHighContrast ? 'normal' : 'high');
  };

  return (
    <ToggleButton
      $pressed={isHighContrast}
      aria-label={ariaLabel}
      aria-pressed={isHighContrast}
      disabled={disabled}
      type="button"
      onClick={handleToggleContrastMode}
      {...props}
    >
      <Icon
        color={isHighContrast ? 'icon.primary' : 'icon.secondary'}
        icon={isHighContrast ? 'contrast-filled' : 'contrast-lined'}
        size={16}
      />
    </ToggleButton>
  );
};

const ToggleButton = styled.button<{ $pressed: boolean }>(({ $pressed, theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: theme.pxToRem(38),
  height: theme.pxToRem(38),
  padding: 0,
  border: `1px solid ${$pressed ? theme.color.border.subtle : 'transparent'}`,
  borderRadius: theme.radius.full,
  background: $pressed ? theme.color.bg.elevated : theme.color.bg['dim-soft'],
  boxShadow: $pressed ? theme.effect['color-mode-toggle-light-shadow'] : 'none',
  cursor: 'pointer',
  transition: 'background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease',

  '&:active': {
    transform: 'scale(0.98)',
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },

  '&:disabled': {
    opacity: 0.48,
    cursor: 'not-allowed',
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',

    '&:active': {
      transform: 'none',
    },
  },
}));
