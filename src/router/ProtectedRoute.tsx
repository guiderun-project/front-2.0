import type { ReactElement, ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import type { RoleEnum, UserInfoGetResponse } from '@/api/types';
import { useAuth } from '@/contexts';
import { APP_PATH } from './path';

type ProtectedRouteAccess = 'authenticated' | 'approved';

type ProtectedRouteProps = {
  access?: ProtectedRouteAccess;
  children: ReactNode;
};

const APPROVED_ROLES = new Set<RoleEnum>([
  'ROLE_USER',
  'ROLE_ADMIN',
  'ROLE_COACH',
]);

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
}: ProtectedRouteProps): ReactElement | null => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    // TODO: 인증 로딩 UI가 확정되면 직접 진입/새로고침 중 빈 화면 대신 표시한다.
    return null;
  }

  if (canAccessProtectedRoute(user, access)) {
    return <>{children}</>;
  }

  return (
    <Navigate
      replace
      state={{ from: location }}
      to={user ? APP_PATH.HOME : APP_PATH.LOGIN}
    />
  );
};
