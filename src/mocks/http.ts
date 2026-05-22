import { HttpResponse } from 'msw';

import { baseURL } from '@/api/core/client';

export const apiUrl = (path: string) => `${baseURL}${path}`;

export const noContent = () => new HttpResponse(null, { status: 204 });

export const notFound = (message = 'Mock resource not found') => {
  return HttpResponse.json({ errorCode: 'NOT_FOUND', message }, { status: 404 });
};

export const badRequest = (message = 'Bad mock request') => {
  return HttpResponse.json(
    { errorCode: 'BAD_REQUEST', message },
    { status: 400 },
  );
};

export const conflict = (message = 'Mock resource conflict') => {
  return HttpResponse.json({ errorCode: 'CONFLICT', message }, { status: 409 });
};

export const getSearchNumber = (
  request: Request,
  key: string,
  fallback: number,
) => {
  const value = new URL(request.url).searchParams.get(key);

  if (!value) {
    return fallback;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : fallback;
};

export const getSearchString = (
  request: Request,
  key: string,
  fallback = '',
) => {
  return new URL(request.url).searchParams.get(key) ?? fallback;
};

export const hasAuthorization = (request: Request) => {
  return Boolean(request.headers.get('Authorization'));
};

export const refreshTokenCookie =
  'refreshToken=mock-refresh-token; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=2592000';

export const expiredRefreshTokenCookie =
  'refreshToken=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0';
