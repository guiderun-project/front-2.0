import { StrictMode } from 'react';

import { Global, ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { baseURL } from '@/api/core/client';
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

const bootstrap = async () => {
  await enableMocking();

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <Global styles={globalStyles} />
            <ColorModeProvider>
              <RouterProvider router={router} />
            </ColorModeProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
};

void bootstrap();
