export const ACCESS_TOKEN_STORAGE_KEY = 'guiderun.accessToken';

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const getAccessToken = () => {
  return getStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? null;
};

export const setAccessToken = (accessToken: string) => {
  // TODO: Temporary localStorage storage. Replace with an in-memory/httpOnly cookie strategy once auth policy is finalized.
  getStorage()?.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};

export const clearAccessToken = () => {
  getStorage()?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};
