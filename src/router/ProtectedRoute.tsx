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

  // 무음 리다이렉트를 막기 위해 사유를 담아 보내면, 앱 셸의 라우트 어나운서
  // (App.tsx RouteAnnouncer)가 srAnnouncement를 라이브 리전으로 낭독한다.
  const srAnnouncement = user
    ? '아직 이용 승인이 완료되지 않아 시작하기 페이지로 이동했어요.'
    : '로그인이 필요해 시작하기 페이지로 이동했어요.';

  return (
    <Navigate
      replace
      state={{ from: location, srAnnouncement }}
      to={APP_PATH.INTRO}
    />
  );
};
