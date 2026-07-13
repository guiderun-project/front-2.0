import { useEffect, useLayoutEffect } from 'react';

import styled from '@emotion/styled';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { LoaderScreen } from '@/components/Loader';
import { PageLayout } from '@/components/PageLayout';
import { ToastViewport } from '@/components/Toast';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

const FIRST_VISIT_STORAGE_KEY = 'guiderun.firstVisitSeen';
const FIRST_VISIT_REDIRECT_EXCLUDED_PATHS = [
  APP_PATH.INTRO,
  APP_PATH.OAUTH,
  APP_PATH.LOGIN,
  APP_PATH.SIGNUP,
  APP_PATH.ACCOUNT_FIND,
  APP_PATH.TERMS,
] as const;

const App = () => {
  const shouldRenderOutlet = useFirstVisitIntroGate();

  return (
    <AppWrapper>
      <ScrollToTop />
      <MobileViewport>
        {shouldRenderOutlet ? (
          <Outlet />
        ) : (
          <PageLayout background="bg.subtle" gradient="gradient.bg.brand-main">
            <LoaderScreen label="사용자 정보를 불러오는 중이에요." />
          </PageLayout>
        )}
        <ToastViewport />
      </MobileViewport>
    </AppWrapper>
  );
};

export default App;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

const useFirstVisitIntroGate = (): boolean => {
  const { isAuthReady, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const shouldRedirect =
    isAuthReady &&
    user === null &&
    !isFirstVisitRedirectExcludedPath(location.pathname) &&
    !hasSeenFirstVisit();

  useEffect(() => {
    if (!shouldRedirect) {
      return;
    }

    recordFirstVisitSeen();
    navigate(APP_PATH.INTRO, {
      replace: true,
      state: { from: location },
    });
  }, [location, navigate, shouldRedirect]);

  return isAuthReady && !shouldRedirect;
};

const isFirstVisitRedirectExcludedPath = (pathname: string): boolean => {
  return FIRST_VISIT_REDIRECT_EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
};

const hasSeenFirstVisit = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    return window.localStorage.getItem(FIRST_VISIT_STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
};

const recordFirstVisitSeen = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(FIRST_VISIT_STORAGE_KEY, 'true');
    return true;
  } catch {
    return false;
  }
};

const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  justify-content: center;
  background-color: var(
    --page-layout-background-color,
    ${({ theme }) => theme.color.bg.subtle}
  );
  background-image: var(--page-layout-background-image, none);
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 100% var(--page-layout-background-gradient-height, 100%);
`;

const MobileViewport = styled.div`
  --app-mobile-viewport-width: ${({ theme }) => theme.layout.mobileViewportMaxWidth};

  width: 100%;
  max-width: var(--app-mobile-viewport-width);
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  background-color: var(
    --page-layout-background-color,
    ${({ theme }) => theme.color.bg.default}
  );
`;
