import { isAxiosError } from 'axios';

import type { ErrorType, FieldErrorType } from '@/api/types/error';

export type ApiErrorKind =
  | 'validation'
  | 'auth'
  | 'permission'
  | 'notFound'
  | 'conflict'
  | 'server'
  | 'network'
  | 'unknown';

type ApiErrorParams = {
  message: string;
  kind: ApiErrorKind;
  status?: number;
  errorCode?: string;
  path?: string;
  timestamp?: string;
  fieldErrors?: FieldErrorType[];
  method?: string;
  url?: string;
  cause?: unknown;
};

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  errorCode?: string;
  path?: string;
  timestamp?: string;
  fieldErrors?: FieldErrorType[];
  method?: string;
  url?: string;

  constructor({
    message,
    kind,
    status,
    errorCode,
    path,
    timestamp,
    fieldErrors,
    method,
    url,
    cause,
  }: ApiErrorParams) {
    super(message, { cause });
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.errorCode = errorCode;
    this.path = path;
    this.timestamp = timestamp;
    this.fieldErrors = fieldErrors;
    this.method = method;
    this.url = url;
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  if (isApiError(error) && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const isUnauthorizedApiError = (error: unknown) => {
  return isApiError(error) && error.status === 401;
};

export const isNotFoundApiError = (error: unknown) => {
  return isApiError(error) && error.status === 404;
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error;
  }

  if (!isAxiosError<ErrorType>(error)) {
    return new ApiError({
      message: '예상치 못한 오류가 발생했어요.',
      kind: 'unknown',
      cause: error,
    });
  }

  const method = error.config?.method?.toUpperCase();
  const url = error.config?.url;

  if (!error.response) {
    return new ApiError({
      message: '네트워크 연결을 확인해주세요.',
      kind: 'network',
      method,
      url,
      cause: error,
    });
  }

  const { data, status } = error.response;
  const message = data?.message || getFallbackMessage(status);

  return new ApiError({
    message,
    kind: resolveApiErrorKind(status),
    status,
    errorCode: data?.errorCode,
    path: data?.path,
    timestamp: data?.timestamp,
    fieldErrors: data?.fieldErrors,
    method,
    url,
    cause: error,
  });
};

const resolveApiErrorKind = (status: number): ApiErrorKind => {
  if (status === 400) {
    return 'validation';
  }
  if (status === 401) {
    return 'auth';
  }
  if (status === 403) {
    return 'permission';
  }
  if (status === 404) {
    return 'notFound';
  }
  if (status === 409) {
    return 'conflict';
  }
  if (status >= 500) {
    return 'server';
  }

  return 'unknown';
};

const getFallbackMessage = (status: number) => {
  if (status === 401) {
    return '로그인이 필요해요.';
  }
  if (status === 403) {
    return '접근 권한이 없어요.';
  }
  if (status === 404) {
    return '요청한 정보를 찾지 못했어요.';
  }
  if (status >= 500) {
    return '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
  }

  return '요청을 처리하지 못했어요.';
};
