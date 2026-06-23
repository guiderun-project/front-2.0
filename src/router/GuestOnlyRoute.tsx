import type { ReactElement, ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts';
import { APP_PATH } from './path';

type GuestOnlyRouteProps = {
  children: ReactNode;
  fallback?: ReactElement;
};

export const GuestOnlyRoute = ({
  children,
  fallback,
}: GuestOnlyRouteProps): ReactElement | null => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return fallback ?? null;
  }

  if (user) {
    return <Navigate replace state={{ from: location }} to={APP_PATH.HOME} />;
  }

  return <>{children}</>;
};
