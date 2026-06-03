import type { ReactElement, ReactNode } from 'react';
import { useCallback, useEffect, useMemo } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { api } from '@/api/services';
import type { UserInfoGetResponse } from '@/api/types';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeAccessTokenChange,
} from '@/api/core/tokenStorage';
import {
  AUTH_USER_QUERY_KEY,
  AuthContext,
  type AuthContextValue,
} from './AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

const isUnauthorizedError = (error: unknown) => {
  return isAxiosError(error) && error.response?.status === 401;
};

const shouldRetryAuthUserQuery = (failureCount: number, error: unknown) => {
  return !isUnauthorizedError(error) && failureCount < 2;
};

const fetchAuthenticatedUser = async (
  previousUser: UserInfoGetResponse | null,
): Promise<UserInfoGetResponse | null> => {
  if (!getAccessToken()) {
    try {
      const { accessToken } = await api.auth.accessTokenReissuePost();

      setAccessToken(accessToken);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        clearAccessToken();
        return null;
      }

      if (previousUser) {
        return previousUser;
      }

      throw error;
    }
  }

  try {
    return await api.user.personalGet();
  } catch (error) {
    if (isUnauthorizedError(error)) {
      clearAccessToken();
      return null;
    }

    if (previousUser) {
      return previousUser;
    }

    throw error;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const queryClient = useQueryClient();
  const getCachedAuthUser = useCallback(() => {
    return (
      queryClient.getQueryData<UserInfoGetResponse | null>(
        AUTH_USER_QUERY_KEY,
      ) ?? null
    );
  }, [queryClient]);
  const fetchAuthUser = useCallback(() => {
    return fetchAuthenticatedUser(getCachedAuthUser());
  }, [getCachedAuthUser]);
  const authUserQuery = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: fetchAuthUser,
    gcTime: Infinity,
    retry: shouldRetryAuthUserQuery,
    staleTime: Infinity,
  });

  const refreshUser = useCallback(async () => {
    return queryClient.fetchQuery({
      queryKey: AUTH_USER_QUERY_KEY,
      queryFn: fetchAuthUser,
      gcTime: Infinity,
      retry: shouldRetryAuthUserQuery,
      staleTime: 0,
    });
  }, [fetchAuthUser, queryClient]);

  const clearSession = useCallback(() => {
    clearAccessToken();
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
  }, [queryClient]);

  const startSession = useCallback(
    async (accessToken: string) => {
      setAccessToken(accessToken);

      return refreshUser();
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    try {
      await api.auth.logoutPost();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    return subscribeAccessTokenChange((accessToken) => {
      if (!accessToken) {
        queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
      }
    });
  }, [queryClient]);

  const user = authUserQuery.data ?? null;
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAuthReady: !authUserQuery.isPending,
      refreshUser,
      startSession,
      logout,
      clearSession,
    }),
    [
      authUserQuery.isPending,
      clearSession,
      logout,
      refreshUser,
      startSession,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
