import type { Theme } from '@emotion/react';

export const HIGH_CONTRAST_SELECTOR = '&:is(:root[data-contrast="high"] *)';

type HighContrastBoundaryOptions = {
  width?: 1 | 2;
};

export const highContrastOutline = (
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
  [HIGH_CONTRAST_SELECTOR]: highContrastOutline(theme, options),
});
