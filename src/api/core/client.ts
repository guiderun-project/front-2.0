import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { AccessTokenGetResponse } from '@/api/contracts/auth';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@/api/core/tokenStorage';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is required to start guiderun-front-v2.');
}

export const baseURL = apiBaseUrl;

const sharedConfig = {
  baseURL,
  withCredentials: true,
};

export const publicApi = axios.create(sharedConfig);
export const privateApi = axios.create(sharedConfig);

export const axiosInstance = publicApi;
export const axiosInstanceWithToken = privateApi;

let refreshPromise: Promise<string> | null = null;

const isUnauthorizedError = (error: AxiosError) => {
  return error.response?.status === 401;
};

const isRefreshRequest = (url?: string) => {
  return url?.includes('/oauth/login/reissue') ?? false;
};

const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  accessToken: string,
) => {
  const headers = AxiosHeaders.from(config.headers);

  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;
};

const refreshAccessToken = async () => {
  try {
    const response = await publicApi.get<AccessTokenGetResponse>(
      '/oauth/login/reissue',
    );
    const nextAccessToken = response.data.accessToken;

    if (!nextAccessToken) {
      throw new Error('Access token reissue succeeded without a token.');
    }

    setAccessToken(nextAccessToken);

    return nextAccessToken;
  } catch (error) {
    clearAccessToken();
    throw error;
  } finally {
    refreshPromise = null;
  }
};

privateApi.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    setAuthorizationHeader(config, accessToken);
  }

  return config;
});

privateApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest || !isUnauthorizedError(error)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry || isRefreshRequest(originalRequest.url)) {
      clearAccessToken();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshAccessToken();

      const nextAccessToken = await refreshPromise;
      setAuthorizationHeader(originalRequest, nextAccessToken);

      return privateApi(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);
