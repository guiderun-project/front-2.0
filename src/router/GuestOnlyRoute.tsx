import type { ReactElement, ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts';
import { APP_PATH } from './path';
import { peekReturnPath } from './returnPath';

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
    const returnPath = peekReturnPath();
    // 앱 셸의 라우트 어나운서(App.tsx RouteAnnouncer)가 srAnnouncement를
    // 라이브 리전으로 낭독해 무음 리다이렉트를 막는다.
    return (
      <Navigate
        replace
        state={{
          from: location,
          srAnnouncement: returnPath
            ? '로그인이 완료돼 이전에 보려던 화면으로 이동했어요.'
            : '이미 로그인되어 있어 홈화면으로 이동했어요.',
        }}
        to={returnPath ?? APP_PATH.HOME}
      />
    );
  }

  return <>{children}</>;
};
