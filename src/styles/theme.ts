import {
  color,
  colorPrimitive,
  effect,
  fontFamily,
  fontWeight,
  gradient,
  gradientBaseColor,
  pxToRem,
  radius,
  spacing,
  typography,
} from './tokens';

export const theme = {
  color,
  colorPrimitive,
  effect,
  fontFamily,
  fontWeight,
  gradient,
  gradientBaseColor,
  pxToRem,
  radius,
  spacing,
  typography,
} as const;

export type AppTheme = typeof theme;
