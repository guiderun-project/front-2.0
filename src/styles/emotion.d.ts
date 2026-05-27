import '@emotion/react';

import type { AppTheme } from './theme';

declare module '@emotion/react' {
  export interface Theme {
    color: AppTheme['color'];
    colorPrimitive: AppTheme['colorPrimitive'];
    effect: AppTheme['effect'];
    fontFamily: AppTheme['fontFamily'];
    fontWeight: AppTheme['fontWeight'];
    gradient: AppTheme['gradient'];
    gradientBaseColor: AppTheme['gradientBaseColor'];
    pxToRem: AppTheme['pxToRem'];
    radius: AppTheme['radius'];
    spacing: AppTheme['spacing'];
    typography: AppTheme['typography'];
  }
}
