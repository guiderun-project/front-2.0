type AccessTokenChangeListener = (accessToken: string | null) => void;

let accessTokenMemory: string | null = null;
const accessTokenChangeListeners = new Set<AccessTokenChangeListener>();

const notifyAccessTokenChange = () => {
  accessTokenChangeListeners.forEach((listener) => {
    listener(accessTokenMemory);
  });
};

export const getAccessToken = () => {
  return accessTokenMemory;
};

export const setAccessToken = (accessToken: string) => {
  accessTokenMemory = accessToken;
  notifyAccessTokenChange();
};

export const clearAccessToken = () => {
  accessTokenMemory = null;
  notifyAccessTokenChange();
};

export const subscribeAccessTokenChange = (
  listener: AccessTokenChangeListener,
) => {
  accessTokenChangeListeners.add(listener);

  return () => {
    accessTokenChangeListeners.delete(listener);
  };
};
