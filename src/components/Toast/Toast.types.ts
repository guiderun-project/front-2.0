import type { IconName } from '@/components/Icon';

export type ToastType = 'success' | 'error';

export type ShowToastOptions = {
  type: ToastType;
  icon: IconName;
  content: string;
};

export type ToastPhase = 'visible' | 'closing';

export type ToastItem = ShowToastOptions & {
  id: number;
  phase: ToastPhase;
};

export type ToastContextValue = {
  toast: ToastItem | null;
  showToast: (options: ShowToastOptions) => void;
};
