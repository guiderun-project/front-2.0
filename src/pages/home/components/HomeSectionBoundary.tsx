import { Suspense, type ReactElement, type ReactNode } from 'react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { Button, ErrorBoundary } from '@/components';

import { HomeSectionMessage } from './HomeSectionMessage';

type HomeSectionBoundaryProps = {
  loadingMessage: string;
  errorMessage: string;
  children: ReactNode;
};

export const HomeSectionBoundary = ({
  children,
  errorMessage,
  loadingMessage,
}: HomeSectionBoundaryProps): ReactElement => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={({ reset: retry }) => (
            <HomeSectionMessage role="alert">
              {errorMessage}
              <Button level="secondary" size="s" type="button" onClick={retry}>
                다시 시도
              </Button>
            </HomeSectionMessage>
          )}
        >
          <Suspense
            fallback={
              <HomeSectionMessage role="status">
                {loadingMessage}
              </HomeSectionMessage>
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
