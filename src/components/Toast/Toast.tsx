import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { Icon } from '@/components/Icon';

import {
  TOAST_CLOSE_TRANSITION,
  TOAST_HIDDEN_ANIMATION,
  TOAST_ICON_COLOR,
  TOAST_OPEN_TRANSITION,
  TOAST_REDUCED_MOTION_TRANSITION,
  TOAST_SWEEP_TRANSITION,
  TOAST_VISIBLE_ANIMATION,
} from './Toast.constants';
import type { ToastItem, ToastType } from './Toast.types';

type ToastProps = {
  toast: ToastItem;
  shouldReduceMotion: boolean;
};

export const Toast = ({ shouldReduceMotion, toast }: ToastProps): ReactElement => {
  const isClosing = toast.phase === 'closing';

  return (
    <ToastRoot
      key={toast.id}
      initial={shouldReduceMotion ? false : TOAST_HIDDEN_ANIMATION}
      animate={
        shouldReduceMotion
          ? TOAST_VISIBLE_ANIMATION
          : isClosing
            ? TOAST_HIDDEN_ANIMATION
            : TOAST_VISIBLE_ANIMATION
      }
      transition={
        shouldReduceMotion
          ? TOAST_REDUCED_MOTION_TRANSITION
          : isClosing
            ? TOAST_CLOSE_TRANSITION
            : TOAST_OPEN_TRANSITION
      }
    >
      <Sweep
        aria-hidden="true"
        $type={toast.type}
        initial={shouldReduceMotion ? false : { x: '0%' }}
        animate={shouldReduceMotion ? { x: '0%' } : { x: '100%' }}
        transition={shouldReduceMotion ? TOAST_REDUCED_MOTION_TRANSITION : TOAST_SWEEP_TRANSITION}
      />
      <IconSlot>
        <Icon aria-hidden={true} color={TOAST_ICON_COLOR[toast.type]} icon={toast.icon} size={20} />
      </IconSlot>
      <ToastContent>{toast.content}</ToastContent>
    </ToastRoot>
  );
};

const ToastRoot = styled(motion.div)(({ theme }) => {
  const typography = theme.typography['body-s-sb'];

  return {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: 'fit-content',
    maxWidth: `min(${theme.pxToRem(300)}, 100%)`,
    gap: theme.spacing.md,
    overflow: 'hidden',
    padding: `${theme.spacing.xl} ${theme.spacing['2xl']} ${theme.spacing.xl} ${theme.spacing.xl}`,
    borderRadius: theme.radius.full,
    backgroundColor: theme.color.bg.glass,
    boxShadow: theme.effect['toast-shadow'],
    color: theme.color.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    letterSpacing: typography.letterSpacing,
    lineHeight: typography.lineHeight,
    pointerEvents: 'none',
    WebkitBackdropFilter: 'blur(6px)',
    backdropFilter: 'blur(6px)',
    transformOrigin: 'top center',
  };
});

const Sweep = styled(motion.span, {
  shouldForwardProp: (propName) => propName !== '$type',
})<{ $type: ToastType }>(({ $type, theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: theme.pxToRem(-63),
  width: theme.pxToRem(180),
  minHeight: theme.pxToRem(53),
  backgroundImage: theme.gradient.feedback.toastSweep[$type],
  pointerEvents: 'none',
}));

const IconSlot = styled.span({
  position: 'relative',
  zIndex: 1,
  display: 'inline-flex',
  flexShrink: 0,
});

const ToastContent = styled.p(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  minWidth: 0,
  margin: 0,
  color: theme.color.text.primary,
  overflowWrap: 'anywhere',
  whiteSpace: 'normal',
  wordBreak: 'keep-all',
}));
