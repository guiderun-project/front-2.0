import type { ReactElement, ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

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
    // TODO: 인증 로딩 UI가 확정되면 직접 진입/새로고침 중 빈 화면 대신 표시한다.
    return null;
  }

  if (user) {
    return <Navigate replace state={{ from: location }} to={APP_PATH.HOME} />;
  }

  return <>{children}</>;
};
