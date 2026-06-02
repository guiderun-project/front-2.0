import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { ColorModeContext } from './colorModeContext';
import {
  applyDocumentColorMode,
  getStoredColorMode,
  getSystemColorMode,
  storeColorMode,
} from './colorModeStorage';
import type { ColorMode } from './tokens';

type ColorModeState = {
  colorMode: ColorMode;
  hasExplicitColorMode: boolean;
};

type ColorModeProviderProps = {
  children: ReactNode;
};

const getInitialColorModeState = (): ColorModeState => {
  const storedColorMode = getStoredColorMode();

  if (storedColorMode) {
    return {
      colorMode: storedColorMode,
      hasExplicitColorMode: true,
    };
  }

  return {
    colorMode: getSystemColorMode(),
    hasExplicitColorMode: false,
  };
};

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [state, setState] = useState<ColorModeState>(getInitialColorModeState);

  useEffect(() => {
    applyDocumentColorMode(state.hasExplicitColorMode ? state.colorMode : null);
  }, [state.colorMode, state.hasExplicitColorMode]);

  useEffect(() => {
    if (state.hasExplicitColorMode || typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemColorModeChange = () => {
      setState((currentState) => {
        if (currentState.hasExplicitColorMode) {
          return currentState;
        }

        return {
          colorMode: getSystemColorMode(),
          hasExplicitColorMode: false,
        };
      });
    };

    mediaQuery.addEventListener('change', handleSystemColorModeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemColorModeChange);
    };
  }, [state.hasExplicitColorMode]);

  const setColorMode = useCallback((colorMode: ColorMode) => {
    storeColorMode(colorMode);
    setState({
      colorMode,
      hasExplicitColorMode: true,
    });
  }, []);

  const value = useMemo(
    () => ({
      colorMode: state.colorMode,
      setColorMode,
    }),
    [setColorMode, state.colorMode],
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};
