import { StrictMode, type ReactNode } from 'react';

import { Global, ThemeProvider } from '@emotion/react';
import { PostHogProvider } from '@posthog/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { baseURL } from '@/api/core/client';
import { BirthDateGate } from '@/components/BirthDateGate';
import { LoaderScreen } from '@/components/Loader';
import {
  PageLayout,
  type PageLayoutBackground,
  type PageLayoutGradientBackground,
} from '@/components/PageLayout';
import { RunningRecordGate } from '@/components/RunningRecordGate';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/contexts';
import { APP_PATH } from '@/router/path';
import { router } from '@/router/router';
import { ColorModeProvider } from '@/styles/colorMode';
import { globalStyles } from '@/styles/globalStyles';
import { theme } from '@/styles/theme';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

void baseURL;

const root = createRoot(rootElement);
const EVENT_DETAIL_PATH_PREFIX = `${APP_PATH.EVENTS}/`;
const EVENT_DETAIL_RESERVED_PATHS = [
  APP_PATH.EVENT_NEW,
  APP_PATH.EVENT_SEARCH,
  APP_PATH.EVENT_SUPPORT,
] as const;
const postHogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const postHogOptions = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: '2026-05-30',
} as const;

type BootstrapLoaderState = {
  background: PageLayoutBackground;
  gradient?: PageLayoutGradientBackground;
  showLoader: boolean;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const enableMocking = async () => {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  await worker.start({
    onUnhandledRequest: 'bypass',
  });
};

const isEventDetailPath = (pathname: string) => {
  if (!pathname.startsWith(EVENT_DETAIL_PATH_PREFIX)) {
    return false;
  }

  return EVENT_DETAIL_RESERVED_PATHS.every(
    (path) => pathname !== path && !pathname.startsWith(`${path}/`),
  );
};

const getBootstrapLoaderState = (): BootstrapLoaderState => {
  const { pathname } = window.location;

  if (pathname === APP_PATH.HOME) {
    return {
      background: 'bg.subtle',
      gradient: 'gradient.bg.brand-main',
      showLoader: true,
    };
  }

  if (pathname === APP_PATH.INTRO) {
    return {
      background: 'bg.subtle',
      gradient: 'gradient.bg.brand-main',
      showLoader: false,
    };
  }

  if (isEventDetailPath(pathname)) {
    return {
      background: 'bg.brand-event',
      gradient: 'gradient.bg.brand-event',
      showLoader: true,
    };
  }

  return {
    background: 'bg.default',
    showLoader: false,
  };
};

const renderBootstrapLoader = () => {
  const { background, gradient, showLoader } = getBootstrapLoaderState();

  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        <ColorModeProvider>
          <PageLayout background={background} gradient={gradient}>
            {showLoader ? <LoaderScreen /> : null}
          </PageLayout>
        </ColorModeProvider>
      </ThemeProvider>
    </StrictMode>,
  );
};

const renderWithPostHogProvider = (children: ReactNode) => {
  if (!postHogProjectToken) {
    return children;
  }

  return (
    <PostHogProvider apiKey={postHogProjectToken} options={postHogOptions}>
      {children}
    </PostHogProvider>
  );
};

const bootstrap = async () => {
  renderBootstrapLoader();

  await enableMocking();

  root.render(
    <StrictMode>
      {renderWithPostHogProvider(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <Global styles={globalStyles} />
              <ColorModeProvider>
                <ToastProvider>
                  <RouterProvider router={router} />
                  <BirthDateGate />
                  <RunningRecordGate />
                </ToastProvider>
              </ColorModeProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>,
      )}
    </StrictMode>,
  );
};

void bootstrap();
