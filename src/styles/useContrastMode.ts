import { useContext } from 'react';

import { ContrastModeContext } from './contrastModeContext';

export const useContrastMode = () => {
  const context = useContext(ContrastModeContext);

  if (!context) {
    throw new Error('useContrastMode must be used within ContrastModeProvider');
  }

  return context;
};
