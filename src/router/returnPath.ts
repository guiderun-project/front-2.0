import type { Location } from 'react-router-dom';

import { APP_PATH } from './path';

export const RETURN_PATH_STORAGE_KEY = 'guiderun.returnPathAfterLogin';

export type ReturnLocation = Pick<Location, 'pathname' | 'search' | 'hash'>;

const AUTH_FLOW_PATHS = [
  APP_PATH.INTRO,
  APP_PATH.OAUTH,
  APP_PATH.LOGIN,
  APP_PATH.SIGNUP,
];

export const isAuthFlowPath = (pathname: string) => {
  return AUTH_FLOW_PATHS.some(
    (authFlowPath) =>
      pathname === authFlowPath || pathname.startsWith(`${authFlowPath}/`),
  );
};

const isReturnablePath = (path: string) => {
  if (!path.startsWith('/') || path.startsWith('//')) {
    return false;
  }

  const [pathname] = path.split(/[?#]/);

  return !isAuthFlowPath(pathname);
};

export const saveReturnPath = (location: ReturnLocation) => {
  if (typeof window === 'undefined') {
    return;
  }

  const path = `${location.pathname}${location.search}${location.hash}`;

  if (!isReturnablePath(path)) {
    return;
  }

  try {
    window.sessionStorage.setItem(RETURN_PATH_STORAGE_KEY, path);
  } catch {
    return;
  }
};

export const peekReturnPath = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedPath = window.sessionStorage.getItem(RETURN_PATH_STORAGE_KEY);

    return storedPath !== null && isReturnablePath(storedPath)
      ? storedPath
      : null;
  } catch {
    return null;
  }
};

export const clearReturnPath = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.removeItem(RETURN_PATH_STORAGE_KEY);
  } catch {
    return;
  }
};
