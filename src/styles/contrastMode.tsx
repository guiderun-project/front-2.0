import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { registerSuperProperties } from '@/api/core';

import { ContrastModeContext } from './contrastModeContext';
import {
  applyDocumentContrastMode,
  getStoredContrastMode,
  storeContrastMode,
} from './contrastModeStorage';
import type { ContrastMode } from './tokens';

type ContrastModeProviderProps = {
  children: ReactNode;
};

const getInitialContrastMode = (): ContrastMode => getStoredContrastMode() ?? 'normal';

export const ContrastModeProvider = ({ children }: ContrastModeProviderProps) => {
  const [contrastMode, setContrastModeState] = useState<ContrastMode>(getInitialContrastMode);

  useEffect(() => {
    applyDocumentContrastMode(contrastMode);
  }, [contrastMode]);

  useEffect(() => {
    registerSuperProperties({ contrastMode });
  }, [contrastMode]);

  const setContrastMode = useCallback((mode: ContrastMode) => {
    storeContrastMode(mode);
    setContrastModeState(mode);
  }, []);

  const value = useMemo(
    () => ({
      contrastMode,
      setContrastMode,
    }),
    [contrastMode, setContrastMode],
  );

  return (
    <ContrastModeContext.Provider value={value}>{children}</ContrastModeContext.Provider>
  );
};
