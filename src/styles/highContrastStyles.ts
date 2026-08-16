import type { Theme } from '@emotion/react';

const HIGH_CONTRAST_SELECTOR = ':root[data-contrast="high"] &';

type HighContrastBoundaryOptions = {
  width?: 1 | 2;
};

export const highContrastBoundary = (
  theme: Theme,
  { width = 1 }: HighContrastBoundaryOptions = {},
) => ({
  [HIGH_CONTRAST_SELECTOR]: {
    outline: `${width}px solid ${theme.color.border.default}`,
    outlineOffset: `-${width}px`,
  },
});
