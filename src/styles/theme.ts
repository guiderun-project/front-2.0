import { fontFamily, fontWeight, typography } from './tokens';

export const theme = {
  fontFamily,
  fontWeight,
  typography,
} as const;

export type AppTheme = typeof theme;

