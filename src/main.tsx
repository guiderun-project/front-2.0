import { StrictMode } from 'react';

import { Global, ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { baseURL } from '@/api/core/client';
import { BirthDateGate } from '@/components/BirthDateGate';
import { LoaderScreen } from '@/components/Loader';
import { PageLayout, type PageLayoutBackground } from '@/components/PageLayout';
import { RunningRecordGate } from '@/components/RunningRecordGate';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/contexts';
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
const EVENT_DETAIL_PATH_PATTERN =
  /^\/events\/(?!new(?:\/|$)|search(?:\/|$)|supports(?:\/|$))[^/]+(?:\/|$)/;

type BootstrapLoaderState = {
  background: PageLayoutBackground;
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

const getBootstrapLoaderState = (): BootstrapLoaderState => {
  const { pathname } = window.location;

  if (pathname === '/') {
    return {
      background: 'gradient.bg.brand-main',
      showLoader: true,
    };
  }

  if (pathname === '/intro') {
    return {
      background: 'gradient.bg.brand-main',
      showLoader: false,
    };
  }

  if (EVENT_DETAIL_PATH_PATTERN.test(pathname)) {
    return {
      background: 'gradient.bg.brand-event',
      showLoader: true,
    };
  }

  return {
    background: 'bg.default',
    showLoader: false,
  };
};

const renderBootstrapLoader = () => {
  const { background, showLoader } = getBootstrapLoaderState();

  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        <ColorModeProvider>
          <PageLayout background={background}>
            {showLoader ? <LoaderScreen /> : null}
          </PageLayout>
        </ColorModeProvider>
      </ThemeProvider>
    </StrictMode>,
  );
};

const bootstrap = async () => {
  renderBootstrapLoader();

  await enableMocking();

  root.render(
    <StrictMode>
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
      </QueryClientProvider>
    </StrictMode>,
  );
};

void bootstrap();
