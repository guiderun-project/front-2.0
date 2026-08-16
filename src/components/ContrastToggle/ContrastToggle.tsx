import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon } from '@/components/Icon';
import { highContrastBoundary } from '@/styles/highContrastStyles';
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
      aria-label={ariaLabel}
      aria-pressed={isHighContrast}
      disabled={disabled}
      type="button"
      onClick={handleToggleContrastMode}
      {...props}
    >
      <ToggleControl $pressed={isHighContrast}>
        <Icon
          color={isHighContrast ? 'icon.primary' : 'icon.secondary'}
          icon={isHighContrast ? 'contrast-filled' : 'contrast-lined'}
          size={16}
        />
      </ToggleControl>
    </ToggleButton>
  );
};

const ToggleButton = styled.button(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: theme.pxToRem(38),
  height: theme.pxToRem(38),
  padding: theme.spacing.s,
  border: 0,
  borderRadius: theme.radius.full,
  background: theme.color.bg['dim-soft'],
  cursor: 'pointer',
  transition: 'transform 120ms ease',

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

  ...highContrastBoundary(theme),
}));

const ToggleControl = styled.span<{ $pressed: boolean }>(({ $pressed, theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  border: `1px solid ${$pressed ? theme.color.border.subtle : 'transparent'}`,
  borderRadius: theme.radius.full,
  background: $pressed ? theme.color.bg.elevated : 'transparent',
  boxShadow: $pressed ? theme.effect['color-mode-toggle-light-shadow'] : 'none',
  transition:
    'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));
