import { useContext } from 'react';

import { ColorModeContext } from './colorModeContext';

export const useColorMode = () => {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error('useColorMode must be used within ColorModeProvider');
  }

  return context;
};
