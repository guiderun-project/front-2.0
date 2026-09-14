type CheckWebviewResult = {
  isWebview: boolean;
};

export const useCheckWebview = (): CheckWebviewResult => {
  const isWebview =
    typeof window !== 'undefined' && window.ReactNativeWebView !== undefined;

  return { isWebview };
};
