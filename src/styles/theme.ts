import { fontFamily, fontWeight, pxToRem, radius, spacing, typography } from './tokens';

export const theme = {
  fontFamily,
  fontWeight,
  pxToRem,
  radius,
  spacing,
  typography,
} as const;

export type AppTheme = typeof theme;
