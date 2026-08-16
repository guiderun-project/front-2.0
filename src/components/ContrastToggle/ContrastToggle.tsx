import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { IconButton } from '@/components/Icon';
import { useContrastMode } from '@/styles/useContrastMode';

const CONTRAST_TOGGLE_WIDTH = 32;
const CONTRAST_TOGGLE_HEIGHT = 30;
const CONTRAST_TOGGLE_ICON_SIZE = 16;

type ContrastToggleProps = {
  disabled?: boolean;
  'aria-label'?: string;
} & Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-pressed' | 'children' | 'color' | 'onClick' | 'type'
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
      color={isHighContrast ? 'icon.primary' : 'icon.secondary'}
      disabled={disabled}
      icon={isHighContrast ? 'contrast-filled' : 'contrast-lined'}
      iconSize={CONTRAST_TOGGLE_ICON_SIZE}
      shape="round"
      size={CONTRAST_TOGGLE_WIDTH}
      onClick={handleToggleContrastMode}
      {...props}
    />
  );
};

const ToggleButton = styled(IconButton)(({ theme }) => ({
  flexShrink: 0,
  height: theme.pxToRem(CONTRAST_TOGGLE_HEIGHT),
  border: '1px solid transparent',
  backgroundColor: theme.color.bg['dim-soft'],

  '&[aria-pressed="true"]': {
    borderColor: theme.color.border.subtle,
    backgroundColor: theme.color.bg.elevated,
    boxShadow: theme.effect['color-mode-toggle-light-shadow'],
  },
}));
