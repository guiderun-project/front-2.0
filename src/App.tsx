import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { HiddenText } from '@/components/HiddenText';
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
      <RouteFocusManager />
      <MobileViewport>
        {shouldRenderOutlet ? (
          <Outlet />
        ) : (
          <PageLayout background="bg.subtle" gradient="gradient.bg.brand-main">
            <LoaderScreen label="사용자 정보를 불러오는 중이에요." />
          </PageLayout>
        )}
        <ToastViewport />
        <RouteAnnouncer />
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

// 라우트 전환으로 포커스를 갖던 요소가 언마운트되면 포커스가 body로 떨어져
// 스크린리더 커서가 임의 위치로 초기화된다. 새 페이지의 main으로 포커스를
// 옮겨 낭독 시작점을 페이지 최상단으로 정렬한다.
const RouteFocusManager = () => {
  const { pathname } = useLocation();
  const isInitialNavigationRef = useRef(true);

  useEffect(() => {
    // 최초 로드는 문서 처음부터 읽는 스크린리더 기본 동작을 방해하지 않도록 건너뛴다.
    if (isInitialNavigationRef.current) {
      isInitialNavigationRef.current = false;
      return;
    }

    // 렌더 직후 동기 focus는 iOS VoiceOver가 놓칠 수 있어 다음 프레임에 실행한다.
    const frameId = window.requestAnimationFrame(() => {
      // 페이지 자체 포커스 관리(회원가입 단계 등)나 하단 내비게이션처럼
      // 이미 포커스가 살아 있는 경우에는 개입하지 않는다.
      const activeElement = document.activeElement;
      if (activeElement !== null && activeElement !== document.body) {
        return;
      }

      const main = document.querySelector('main');
      if (!(main instanceof HTMLElement)) {
        return;
      }

      main.setAttribute('tabindex', '-1');
      // 프로그래매틱 포커스로 인한 포커스 링이 시각적으로 드러나지 않도록 한다.
      main.style.outline = 'none';
      main.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  return null;
};

const ROUTE_ANNOUNCE_DELAY_MS = 150;

const getSrAnnouncement = (state: unknown): string | null => {
  if (
    state !== null &&
    typeof state === 'object' &&
    'srAnnouncement' in state &&
    typeof state.srAnnouncement === 'string' &&
    state.srAnnouncement !== ''
  ) {
    return state.srAnnouncement;
  }

  return null;
};

// SPA에서는 document.title 변경이 스크린리더에 낭독되지 않으므로, 빈 라이브 리전을
// 상시 마운트해 두고 라우트 전환 후 약간의 지연을 두어 새 페이지 제목을 주입한다.
// 리다이렉트 사유(location.state.srAnnouncement)가 있으면 그것을 우선 낭독한다.
const RouteAnnouncer = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const isInitialNavigationRef = useRef(true);

  useEffect(() => {
    // 최초 로드는 브라우저가 문서 제목을 직접 낭독하므로 건너뛴다.
    if (isInitialNavigationRef.current) {
      isInitialNavigationRef.current = false;
      return;
    }

    // iOS VoiceOver는 동일 문자열 재주입을 재낭독하지 않으므로 먼저 비운 뒤 다시 채운다.
    setMessage('');

    const timeoutId = window.setTimeout(() => {
      setMessage(getSrAnnouncement(location.state) ?? document.title);
    }, ROUTE_ANNOUNCE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [location]);

  return (
    <HiddenText aria-atomic={true} role="status">
      {message}
    </HiddenText>
  );
};

const useFirstVisitIntroGate = (): boolean => {
  const { isAuthReady, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstVisitTarget = isAuthReady && user === null && !hasSeenFirstVisit();
  const isRedirectExcluded = isFirstVisitRedirectExcludedPath(location.pathname);
  const shouldRedirect = isFirstVisitTarget && !isRedirectExcluded;

  useEffect(() => {
    if (!isFirstVisitTarget) {
      return;
    }

    recordFirstVisitSeen();

    if (!shouldRedirect) {
      return;
    }

    navigate(APP_PATH.INTRO, {
      replace: true,
      state: { from: location },
    });
  }, [isFirstVisitTarget, location, navigate, shouldRedirect]);

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
