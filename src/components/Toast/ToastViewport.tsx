import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useReducedMotion } from 'framer-motion';

import { Toast } from './Toast';
import { useToastItem } from './ToastContext';

export const ToastViewport = (): ReactElement | null => {
  const toast = useToastItem();
  const shouldReduceMotion = useReducedMotion();

  return (
    <ToastPositioner aria-atomic="true" aria-live="polite" role="status">
      {toast ? (
        <Toast key={toast.id} shouldReduceMotion={Boolean(shouldReduceMotion)} toast={toast} />
      ) : null}
    </ToastPositioner>
  );
};

const ToastPositioner = styled.div(({ theme }) => ({
  position: 'fixed',
  top: 'env(safe-area-inset-top)',
  left: '50%',
  zIndex: theme.zIndex.toast,
  display: 'flex',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: `min(100%, var(--app-mobile-viewport-width, ${theme.layout.mobileViewportMaxWidth}))`,
  paddingInline: theme.spacing.xl,
  pointerEvents: 'none',
  transform: 'translateX(-50%)',
}));
