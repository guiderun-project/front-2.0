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
  zIndex,
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
  zIndex,
} as const;

export type AppTheme = typeof theme;
