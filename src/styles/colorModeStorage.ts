import type { ColorMode } from './tokens';

export const COLOR_MODE_STORAGE_KEY = 'guiderun-color-mode';

export const isColorMode = (value: string | null): value is ColorMode => {
  return value === 'light' || value === 'dark';
};

export const getStoredColorMode = (): ColorMode | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedColorMode = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);

    return isColorMode(storedColorMode) ? storedColorMode : null;
  } catch {
    return null;
  }
};

export const getSystemColorMode = (): ColorMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyDocumentColorMode = (colorMode: ColorMode | null) => {
  if (typeof document === 'undefined') {
    return;
  }

  if (colorMode) {
    document.documentElement.dataset.colorMode = colorMode;
    return;
  }

  delete document.documentElement.dataset.colorMode;
};

export const storeColorMode = (colorMode: ColorMode) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
  } catch {
    // Ignore storage failures so the in-memory theme still updates.
  }
};
