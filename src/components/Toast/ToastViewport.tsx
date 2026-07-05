import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useReducedMotion } from 'framer-motion';

import { HiddenText } from '@/components/HiddenText';

import { Toast } from './Toast';
import { useToastItem } from './ToastContext';

export const ToastViewport = (): ReactElement | null => {
  const toast = useToastItem();
  const shouldReduceMotion = useReducedMotion();

  const shouldAnnounceToast = toast ? toast.announce !== false : false;

  return (
    <>
      <ToastAnnouncer aria-atomic="true" aria-live="polite" role="status">
        {toast && shouldAnnounceToast ? <span key={toast.id}>{toast.content}</span> : null}
      </ToastAnnouncer>
      <ToastPositioner aria-hidden="true">
        {toast ? (
          <Toast key={toast.id} shouldReduceMotion={Boolean(shouldReduceMotion)} toast={toast} />
        ) : null}
      </ToastPositioner>
    </>
  );
};

const ToastAnnouncer = styled(HiddenText)({});

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
