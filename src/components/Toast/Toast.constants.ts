import type { Transition } from 'framer-motion';

import type { ColorToken } from '@/styles/tokens';

import type { ToastType } from './Toast.types';

export const TOAST_CLOSE_DELAY_MS = 1100;
export const TOAST_CLOSE_ANIMATION_MS = 720;

export const TOAST_ICON_COLOR = {
  success: 'icon.brand',
  error: 'border.danger',
} as const satisfies Record<ToastType, ColorToken>;

export const TOAST_VISIBLE_ANIMATION = {
  opacity: 1,
  scale: 1,
  y: 16,
} as const;

export const TOAST_HIDDEN_ANIMATION = {
  opacity: 0.3,
  scale: 0.56,
  y: -52,
} as const;

export const TOAST_OPEN_TRANSITION = {
  type: 'spring',
  stiffness: 170,
  damping: 20,
  mass: 1.2,
} as const satisfies Transition;

export const TOAST_CLOSE_TRANSITION = {
  type: 'spring',
  stiffness: 212,
  damping: 20,
  mass: 1.2,
} as const satisfies Transition;

export const TOAST_SWEEP_TRANSITION = {
  delay: 0.5,
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
} as const satisfies Transition;

export const TOAST_REDUCED_MOTION_TRANSITION = {
  duration: 0,
} as const satisfies Transition;
