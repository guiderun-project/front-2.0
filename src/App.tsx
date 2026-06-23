import { useLayoutEffect } from 'react';

import styled from '@emotion/styled';
import { Outlet, useLocation } from 'react-router-dom';

import { ToastViewport } from '@/components/Toast';

const App = () => {
  return (
    <AppWrapper>
      <ScrollToTop />
      <MobileViewport>
        <Outlet />
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
