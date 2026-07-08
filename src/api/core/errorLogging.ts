import posthog from 'posthog-js';

import type { ApiError } from '@/api/core/apiError';
import { isApiError } from '@/api/core/apiError';

const IDENTIFIER_SEGMENT_PATTERN =
  /^(?:\d+|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|(?=.{8,}$)(?=.*\d)[A-Za-z0-9_-]+)$/i;

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
    url: sanitizePathLikeValue(error.url),
    path: sanitizePathLikeValue(error.path),
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

const sanitizePathLikeValue = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const path = getPathname(value);

  return path
    .split('/')
    .map((segment) => {
      if (IDENTIFIER_SEGMENT_PATTERN.test(segment)) {
        return ':id';
      }

      return segment;
    })
    .join('/');
};

const getPathname = (value: string) => {
  try {
    return new URL(value, 'http://localhost').pathname;
  } catch {
    return value.split(/[?#]/)[0] ?? value;
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
    routeTemplate: sanitizePathLikeValue(window.location.pathname),
    componentStack: info.componentStack,
  });
};

export const captureRouteError = (error: unknown) => {
  if (!isPostHogEnabled() || isApiError(error)) {
    return;
  }

  const properties = {
    routeTemplate: sanitizePathLikeValue(window.location.pathname),
    ...getRouteErrorProperties(error),
  };

  if (error instanceof Error) {
    posthog.captureException(error, properties);
    return;
  }

  posthog.capture('route_error', properties);
};

const getRouteErrorProperties = (error: unknown) => {
  if (!isRouteErrorResponseLike(error)) {
    return {};
  }

  return {
    status: error.status,
    statusText: error.statusText,
  };
};

const isRouteErrorResponseLike = (
  error: unknown,
): error is { status: number; statusText: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number' &&
    'statusText' in error &&
    typeof error.statusText === 'string'
  );
};
