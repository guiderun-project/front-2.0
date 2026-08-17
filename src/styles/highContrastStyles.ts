import type { Theme } from '@emotion/react';

export const HIGH_CONTRAST_SELECTOR = '&:is(:root[data-contrast="high"] *)';

type HighContrastBoundaryOptions = {
  width?: 1 | 2;
};

export const highContrastBoundaryStyle = (
  theme: Theme,
  { width = 1 }: HighContrastBoundaryOptions = {},
) => ({
  boxShadow: `inset 0 0 0 ${width}px ${theme.color.border.default}`,
});

export const highContrastBoundary = (
  theme: Theme,
  options?: HighContrastBoundaryOptions,
) => ({
  [HIGH_CONTRAST_SELECTOR]: highContrastBoundaryStyle(theme, options),
});
