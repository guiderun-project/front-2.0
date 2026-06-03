import { createContext } from 'react';

import type { ColorMode } from './tokens';

export type ColorModeContextValue = {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
};

export const ColorModeContext = createContext<ColorModeContextValue | null>(null);
