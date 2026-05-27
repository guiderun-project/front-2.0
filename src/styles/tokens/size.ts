const ROOT_FONT_SIZE = 16;

export const pxToRem = (px: number) => `${px / ROOT_FONT_SIZE}rem`;

export const spacing = {
  none: pxToRem(0),
  xs: pxToRem(2),
  sm: pxToRem(4),
  md: pxToRem(8),
  lg: pxToRem(12),
  xl: pxToRem(16),
  '2xl': pxToRem(20),
  '3xl': pxToRem(24),
  '4xl': pxToRem(32),
  '5xl': pxToRem(40),
  '6xl': pxToRem(48),
} as const;

export const radius = {
  none: pxToRem(0),
  s: pxToRem(6),
  sm: pxToRem(8),
  md: pxToRem(12),
  lg: pxToRem(16),
  xl: pxToRem(24),
  full: pxToRem(9999),
} as const;
