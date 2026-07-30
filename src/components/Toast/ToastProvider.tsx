import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';

import { useReducedMotion } from 'framer-motion';

import {
  TOAST_CLOSE_ANIMATION_MS,
  TOAST_CLOSE_DELAY_MS,
} from './Toast.constants';
import { ToastContext } from './ToastContext';
import type { ShowToastOptions, ToastItem } from './Toast.types';

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps): ReactElement => {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const removeTimerRef = useRef<number | null>(null);
  const nextToastIdRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  const clearToastTimers = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (removeTimerRef.current !== null) {
      window.clearTimeout(removeTimerRef.current);
      removeTimerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (options: ShowToastOptions) => {
      const id = nextToastIdRef.current + 1;
      nextToastIdRef.current = id;

      clearToastTimers();
      setToast({ ...options, id, phase: 'visible' });

      if (shouldReduceMotion) {
        removeTimerRef.current = window.setTimeout(() => {
          setToast((currentToast) => (currentToast?.id === id ? null : currentToast));
          removeTimerRef.current = null;
        }, TOAST_CLOSE_DELAY_MS);
        return;
      }

      closeTimerRef.current = window.setTimeout(() => {
        setToast((currentToast) =>
          currentToast?.id === id ? { ...currentToast, phase: 'closing' } : currentToast,
        );
        closeTimerRef.current = null;
      }, TOAST_CLOSE_DELAY_MS);

      removeTimerRef.current = window.setTimeout(() => {
        setToast((currentToast) => (currentToast?.id === id ? null : currentToast));
        removeTimerRef.current = null;
      }, TOAST_CLOSE_DELAY_MS + TOAST_CLOSE_ANIMATION_MS);
    },
    [clearToastTimers, shouldReduceMotion],
  );

  useEffect(() => clearToastTimers, [clearToastTimers]);

  const value = useMemo(
    () => ({
      toast,
      showToast,
    }),
    [showToast, toast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
