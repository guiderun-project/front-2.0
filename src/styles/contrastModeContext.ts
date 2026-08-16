import { createContext } from 'react';

import type { ContrastMode } from './tokens';

export type ContrastModeContextValue = {
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
};

export const ContrastModeContext = createContext<ContrastModeContextValue | null>(null);
