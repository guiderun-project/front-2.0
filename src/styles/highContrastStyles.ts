import type { Theme } from '@emotion/react';

export const HIGH_CONTRAST_SELECTOR = '&:is(:root[data-contrast="high"] *)';

type HighContrastBoundaryOptions = {
  width?: 1 | 2;
};

export const highContrastBoundaryStyle = (
  theme: Theme,
  { width = 1 }: HighContrastBoundaryOptions = {},
) => ({
  outline: `${width}px solid ${theme.color.border.default}`,
  outlineOffset: `-${width}px`,
});

export const highContrastBoundary = (
  theme: Theme,
  options?: HighContrastBoundaryOptions,
) => ({
  [HIGH_CONTRAST_SELECTOR]: highContrastBoundaryStyle(theme, options),
});

export const HIGH_CONTRAST_DISABLED_OPACITY = 0.3;

export const highContrastDisabledStyle = {
  opacity: HIGH_CONTRAST_DISABLED_OPACITY,
} as const;

export const highContrastDisabled = {
  [HIGH_CONTRAST_SELECTOR]: highContrastDisabledStyle,
} as const;
