import type { ReactElement, ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import type { UserInfoGetResponse } from '@/api/types';
import { APPROVED_ROLES } from '@/constants';
import { useAuth } from '@/contexts';
import { APP_PATH } from './path';

type ProtectedRouteAccess = 'authenticated' | 'approved';

type ProtectedRouteProps = {
  access?: ProtectedRouteAccess;
  children: ReactNode;
  fallback?: ReactElement;
};

const canAccessProtectedRoute = (
  user: UserInfoGetResponse | null,
  access: ProtectedRouteAccess,
) => {
  if (!user) {
    return false;
  }

  if (access === 'authenticated') {
    return true;
  }

  return APPROVED_ROLES.has(user.role);
};

export const ProtectedRoute = ({
  access = 'authenticated',
  children,
  fallback,
}: ProtectedRouteProps): ReactElement | null => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return fallback ?? null;
  }

  if (canAccessProtectedRoute(user, access)) {
    return <>{children}</>;
  }

  return <Navigate replace state={{ from: location }} to={APP_PATH.INTRO} />;
};
