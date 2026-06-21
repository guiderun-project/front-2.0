import { createContext, useContext, useMemo } from 'react';

import type { ToastContextValue, ToastItem } from './Toast.types';

export const ToastContext = createContext<ToastContextValue | null>(null);

const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export const useToast = (): Pick<ToastContextValue, 'showToast'> => {
  const { showToast } = useToastContext();

  return useMemo(() => ({ showToast }), [showToast]);
};

export const useToastItem = (): ToastItem | null => {
  const { toast } = useToastContext();

  return toast;
};
