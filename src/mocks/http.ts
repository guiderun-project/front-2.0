import { HttpResponse } from 'msw';

import { baseURL } from '@/api/core/client';

const MOCK_REFRESH_SESSION_STORAGE_KEY = 'guiderun.mockRefreshSession';

// 부팅 시 mock 인증 상태. 미설정이면 기존과 동일하게 자동 로그인(true).
// 로컬 .env에서 VITE_MOCK_AUTHENTICATED=false 로 두면 비로그인(게스트)으로 시작한다.
const mockAuthenticatedByEnv =
  import.meta.env.VITE_MOCK_AUTHENTICATED !== 'false';

let mockRefreshSessionMemory = mockAuthenticatedByEnv;

// env로 비로그인을 강제한 경우, 이전 세션에 persisted 된 로그인 플래그까지 제거해
// sessionStorage 값이 env를 덮어쓰지 않도록(항상 게스트로 부팅되도록) 보장한다.
if (!mockAuthenticatedByEnv && typeof window !== 'undefined') {
  window.sessionStorage.removeItem(MOCK_REFRESH_SESSION_STORAGE_KEY);
}

// MSW-only session flag. This is not an accessToken storage path.
const getMockRefreshSessionStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
};

export const apiUrl = (path: string) => `${baseURL}${path}`;

export const noContent = () => new HttpResponse(null, { status: 204 });

export const unauthorized = (message = 'Mock request is unauthorized') => {
  return HttpResponse.json(
    { errorCode: 'UNAUTHORIZED', message },
    { status: 401 },
  );
};

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

export const requireAuthorization = (request: Request) => {
  return hasAuthorization(request) ? null : unauthorized();
};

export const activateMockRefreshSession = () => {
  mockRefreshSessionMemory = true;
  getMockRefreshSessionStorage()?.setItem(
    MOCK_REFRESH_SESSION_STORAGE_KEY,
    'true',
  );
};

export const deactivateMockRefreshSession = () => {
  mockRefreshSessionMemory = false;
  getMockRefreshSessionStorage()?.removeItem(MOCK_REFRESH_SESSION_STORAGE_KEY);
};

export const isMockRefreshSessionActive = () => {
  return (
    mockRefreshSessionMemory ||
    getMockRefreshSessionStorage()?.getItem(MOCK_REFRESH_SESSION_STORAGE_KEY) ===
      'true'
  );
};

export const refreshTokenCookie =
  'refreshToken=mock-refresh-token; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=2592000';

export const expiredRefreshTokenCookie =
  'refreshToken=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0';
