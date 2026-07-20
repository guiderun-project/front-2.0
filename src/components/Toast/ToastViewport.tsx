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
  const announcedToast = toast && shouldAnnounceToast ? toast : null;
  const politeToast = announcedToast?.type !== 'error' ? announcedToast : null;
  const assertiveToast = announcedToast?.type === 'error' ? announcedToast : null;

  return (
    <>
      {/*
        data-live-announcer: react-aria ModalOverlay(BottomSheet/Popup)가 열릴 때
        ariaHideOutside가 모달 밖 요소를 aria-hidden/inert 처리하는데, 이 속성이 있는
        요소만 숨김 대상에서 제외되어 모달이 열린 동안에도 토스트가 낭독된다.
        react-aria 비공개 규약이므로 react-aria 업그레이드 시 회귀 확인이 필요하다.
        오류 토스트는 진행 중인 낭독에 밀리지 않도록 별도 role="alert"(assertive)
        리전에서 낭독한다. 두 리전 모두 상시 마운트를 유지해야 한다.
      */}
      <ToastAnnouncer
        aria-atomic="true"
        aria-live="polite"
        data-live-announcer="true"
        role="status"
      >
        {politeToast ? <span key={politeToast.id}>{politeToast.content}</span> : null}
      </ToastAnnouncer>
      <ToastAnnouncer
        aria-atomic="true"
        aria-live="assertive"
        data-live-announcer="true"
        role="alert"
      >
        {assertiveToast ? (
          <span key={assertiveToast.id}>{assertiveToast.content}</span>
        ) : null}
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
