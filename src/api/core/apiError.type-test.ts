import type { ApiErrorKind } from '@/api/core/apiError';
import {
  ApiError,
  getApiErrorMessage,
  isNotFoundApiError,
  isUnauthorizedApiError,
} from '@/api/core/apiError';
import type { ErrorType } from '@/api/types';

type Assert<T extends true> = T;
type Equal<Left, Right> =
  (<T>() => T extends Left ? 1 : 2) extends
  (<T>() => T extends Right ? 1 : 2)
    ? true
    : false;

export type ErrorTypeSupportsBackendMetadata = Assert<
  Equal<
    keyof ErrorType,
    'errorCode' | 'message' | 'status' | 'path' | 'timestamp' | 'fieldErrors'
  >
>;

export type ApiErrorKindIncludesBackendCases = Assert<
  Equal<
    ApiErrorKind,
    | 'validation'
    | 'auth'
    | 'permission'
    | 'notFound'
    | 'conflict'
    | 'server'
    | 'network'
    | 'unknown'
  >
>;

const unauthorizedError = new ApiError({
  message: '로그인이 필요해요.',
  kind: 'auth',
  status: 401,
});

const notFoundError = new ApiError({
  message: '요청한 정보를 찾지 못했어요.',
  kind: 'notFound',
  status: 404,
});

export const API_ERROR_MESSAGE = getApiErrorMessage(
  unauthorizedError,
  'fallback',
);
export const IS_UNAUTHORIZED_API_ERROR =
  isUnauthorizedApiError(unauthorizedError);
export const IS_NOT_FOUND_API_ERROR = isNotFoundApiError(notFoundError);
