import type { ReactElement, ReactNode } from 'react';
import { useCallback, useEffect, useMemo } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  identifyUser,
  isUnauthorizedApiError,
  resetIdentity,
} from '@/api/core';
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
  return isUnauthorizedApiError(error);
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
    clearAccessToken('signOut');
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
    resetIdentity();
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

  // 로그인/가입/OAuth/세션복원 등 사용자 식별 방식과 무관하게, user가 채워지는
  // 이 지점 한 곳에서만 identify 하면 모든 진입 경로가 커버된다.
  useEffect(() => {
    if (!user) {
      return;
    }

    identifyUser(user);
  }, [user]);

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
