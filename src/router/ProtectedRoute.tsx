import type { ReactElement, ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import type { UserInfoGetResponse } from '@/api/types';
import { LoaderScreen } from '@/components';
import { APPROVED_ROLES } from '@/constants';
import { useAuth } from '@/contexts';
import { APP_PATH } from './path';

type ProtectedRouteAccess = 'authenticated' | 'approved';

type ProtectedRouteProps = {
  access?: ProtectedRouteAccess;
  children: ReactNode;
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
}: ProtectedRouteProps): ReactElement | null => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return <LoaderScreen label="사용자 정보를 불러오는 중이에요." />;
  }

  if (canAccessProtectedRoute(user, access)) {
    return <>{children}</>;
  }

  return <Navigate replace state={{ from: location }} to={APP_PATH.INTRO} />;
};
