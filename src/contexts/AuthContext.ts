import { createContext, useContext } from 'react';

import type { UserInfoGetResponse } from '@/api/types';

export const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const;

export type AuthContextValue = {
  user: UserInfoGetResponse | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  refreshUser: () => Promise<UserInfoGetResponse | null>;
  startSession: (accessToken: string) => Promise<UserInfoGetResponse | null>;
  logout: () => Promise<void>;
  clearSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
};
