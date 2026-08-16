import type { ContrastMode } from './tokens';

export const CONTRAST_MODE_STORAGE_KEY = 'guiderun-contrast-mode';

export const isContrastMode = (value: string | null): value is ContrastMode => {
  return value === 'normal' || value === 'high';
};

export const getStoredContrastMode = (): ContrastMode | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedContrastMode = window.localStorage.getItem(CONTRAST_MODE_STORAGE_KEY);

    return isContrastMode(storedContrastMode) ? storedContrastMode : null;
  } catch {
    return null;
  }
};

export const applyDocumentContrastMode = (contrastMode: ContrastMode) => {
  if (typeof document === 'undefined') {
    return;
  }

  if (contrastMode === 'high') {
    document.documentElement.dataset.contrast = 'high';
    return;
  }

  delete document.documentElement.dataset.contrast;
};

export const storeContrastMode = (contrastMode: ContrastMode) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CONTRAST_MODE_STORAGE_KEY, contrastMode);
  } catch {
    return;
  }
};
