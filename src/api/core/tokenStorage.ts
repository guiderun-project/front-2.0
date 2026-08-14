export type AccessTokenClearReason = 'signOut' | 'sessionExpired';

type AccessTokenChangeListener = (
  accessToken: string | null,
  reason?: AccessTokenClearReason,
) => void;

let accessTokenMemory: string | null = null;
const accessTokenChangeListeners = new Set<AccessTokenChangeListener>();

const notifyAccessTokenChange = (reason?: AccessTokenClearReason) => {
  accessTokenChangeListeners.forEach((listener) => {
    listener(accessTokenMemory, reason);
  });
};

export const getAccessToken = () => {
  return accessTokenMemory;
};

export const setAccessToken = (accessToken: string) => {
  accessTokenMemory = accessToken;
  notifyAccessTokenChange();
};

export const clearAccessToken = (
  reason: AccessTokenClearReason = 'sessionExpired',
) => {
  accessTokenMemory = null;
  notifyAccessTokenChange(reason);
};

export const subscribeAccessTokenChange = (
  listener: AccessTokenChangeListener,
) => {
  accessTokenChangeListeners.add(listener);

  return () => {
    accessTokenChangeListeners.delete(listener);
  };
};
