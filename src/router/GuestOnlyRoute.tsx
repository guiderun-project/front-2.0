import type { ReactElement, ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { LoaderScreen } from '@/components';
import { useAuth } from '@/contexts';
import { APP_PATH } from './path';

type GuestOnlyRouteProps = {
  children: ReactNode;
};

export const GuestOnlyRoute = ({
  children,
}: GuestOnlyRouteProps): ReactElement | null => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return <LoaderScreen label="사용자 정보를 불러오는 중이에요." />;
  }

  if (user) {
    return <Navigate replace state={{ from: location }} to={APP_PATH.HOME} />;
  }

  return <>{children}</>;
};
