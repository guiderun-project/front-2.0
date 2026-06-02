import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { Icon, type IconName } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useColorMode } from '@/styles/useColorMode';
import { resolveColorToken, type ColorMode, type ColorToken } from '@/styles/tokens';

const COLOR_MODE_OPTIONS: ReadonlyArray<{
  icon: {
    default: IconName;
    selected: IconName;
  };
  label: string;
  mode: ColorMode;
}> = [
  {
    icon: {
      default: 'sun-lined',
      selected: 'sun-filled',
    },
    label: '라이트',
    mode: 'light',
  },
  {
    icon: {
      default: 'moon-lined',
      selected: 'moon-filled',
    },
    label: '다크',
    mode: 'dark',
  },
];

export type ColorModeToggleProps = {
  disabled?: boolean;
  'aria-label'?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange' | 'role'>;

const getInactiveColor = (value: ColorMode): ColorToken => {
  return value === 'dark' ? 'text.secondary' : 'text.tertiary';
};

const getInactiveIconColor = (value: ColorMode): ColorToken => {
  return value === 'dark' ? 'icon.secondary' : 'icon.teritary';
};

export const ColorModeToggle = ({
  'aria-label': ariaLabel = '색상 모드',
  disabled = false,
  ...props
}: ColorModeToggleProps): ReactElement => {
  const { colorMode, setColorMode } = useColorMode();

  const handleSelectColorMode = (mode: ColorMode) => {
    if (disabled || mode === colorMode) {
      return;
    }

    setColorMode(mode);
  };

  return (
    <ToggleRoot $disabled={disabled} aria-label={ariaLabel} role="group" {...props}>
      <ToggleIndicator $value={colorMode} aria-hidden={true} />
      {COLOR_MODE_OPTIONS.map(({ icon, label, mode }) => {
        const isSelected = mode === colorMode;

        return (
          <ToggleOption
            key={mode}
            $color={isSelected ? 'text.primary' : getInactiveColor(colorMode)}
            aria-label={`${label} 모드`}
            aria-pressed={isSelected}
            disabled={disabled}
            type="button"
            onClick={() => handleSelectColorMode(mode)}
          >
            <Icon
              color={isSelected ? 'icon.primary' : getInactiveIconColor(colorMode)}
              icon={isSelected ? icon.selected : icon.default}
              size={16}
            />
            <ToggleOptionLabel as="span" font="body-s-sb">
              {label}
            </ToggleOptionLabel>
          </ToggleOption>
        );
      })}
    </ToggleRoot>
  );
};

const ToggleRoot = styled.div<{ $disabled: boolean }>`
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  width: ${({ theme }) => theme.pxToRem(160)};
  height: ${({ theme }) => theme.pxToRem(38)};
  padding: ${({ theme }) => theme.spacing.s};
  gap: ${({ theme }) => theme.spacing.s};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.bg['dim-soft']};
  opacity: ${({ $disabled }) => ($disabled ? 0.48 : 1)};
`;

const ToggleIndicator = styled.span<{ $value: ColorMode }>`
  position: absolute;
  z-index: 0;
  top: ${({ theme }) => theme.spacing.s};
  left: ${({ theme }) => theme.spacing.s};
  width: calc((100% - (${({ theme }) => theme.spacing.s} * 3)) / 2);
  height: ${({ theme }) => theme.pxToRem(30)};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $value, theme }) =>
    $value === 'dark' ? theme.color.bg.overlay : theme.color.bg.elevated};
  box-shadow: ${({ $value, theme }) =>
    $value === 'dark'
      ? theme.effect['color-mode-toggle-dark-shadow']
      : theme.effect['color-mode-toggle-light-shadow']};
  transform: ${({ $value, theme }) =>
    $value === 'dark' ? `translateX(calc(100% + ${theme.spacing.s}))` : 'translateX(0)'};
  transition:
    transform 160ms cubic-bezier(0.2, 0, 0, 1),
    background-color 120ms ease,
    box-shadow 120ms ease;
`;

const ToggleOption = styled.button<{ $color: ColorToken }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: ${({ theme }) => theme.pxToRem(30)};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.md}`};
  gap: ${({ theme }) => theme.spacing.s};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ $color }) => resolveColorToken($color)};
  background: transparent;
  cursor: pointer;
  transition:
    color 120ms ease,
    transform 120ms ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const ToggleOptionLabel = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
