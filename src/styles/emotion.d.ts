import '@emotion/react';

import type { AppTheme } from './theme';

declare module '@emotion/react' {
  export interface Theme {
    fontFamily: AppTheme['fontFamily'];
    fontWeight: AppTheme['fontWeight'];
    pxToRem: AppTheme['pxToRem'];
    radius: AppTheme['radius'];
    spacing: AppTheme['spacing'];
    typography: AppTheme['typography'];
  }
}
