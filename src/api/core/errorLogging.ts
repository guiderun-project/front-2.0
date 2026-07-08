import posthog from 'posthog-js';

import type { ApiError } from '@/api/core/apiError';
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

  if (isExpectedControlFlowApiError(error)) {
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

const isExpectedControlFlowApiError = (error: ApiError) => {
  if (isRefreshTokenReissueFailure(error)) {
    return true;
  }

  return isMyApplicationFormNotFound(error);
};

const isRefreshTokenReissueFailure = (error: ApiError) => {
  return (
    error.status === 401 &&
    error.method === 'POST' &&
    matchesPath(error.url, /^\/(?:api\/)?oauth\/login\/reissue$/)
  );
};

const isMyApplicationFormNotFound = (error: ApiError) => {
  return (
    error.status === 404 &&
    error.method === 'GET' &&
    matchesPath(error.url, /^\/(?:api\/)?event\/[^/]+\/form$/)
  );
};

const matchesPath = (url: string | undefined, pattern: RegExp) => {
  if (!url) {
    return false;
  }

  try {
    return pattern.test(new URL(url, 'http://localhost').pathname);
  } catch {
    return pattern.test(url);
  }
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
