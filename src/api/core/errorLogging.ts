import posthog from 'posthog-js';

import { isApiError } from '@/api/core/apiError';

const isPostHogEnabled = () => {
  return Boolean(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN);
};

export const captureApiError = (error: unknown) => {
  if (!isPostHogEnabled()) {
    return;
  }

  if (!isApiError(error)) {
    posthog.captureException(error);
    return;
  }

  const properties = {
    status: error.status,
    errorCode: error.errorCode,
    kind: error.kind,
    method: error.method,
    url: error.url,
    path: error.path,
  };

  if (['server', 'network', 'unknown'].includes(error.kind)) {
    posthog.captureException(error, properties);
    return;
  }

  posthog.capture('api_error', properties);
};

export const captureRenderError = (
  error: Error,
  info: { componentStack?: string },
) => {
  if (!isPostHogEnabled()) {
    return;
  }

  posthog.captureException(error, {
    route: window.location.pathname,
    componentStack: info.componentStack,
  });
};
