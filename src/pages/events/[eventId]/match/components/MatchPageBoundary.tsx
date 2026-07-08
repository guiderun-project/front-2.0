import { Suspense, type ReactElement, type ReactNode } from 'react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/api/core';
import { ErrorBoundary } from '@/components';

import type { MatchMessageState } from '../matchPageState';
import { MatchMessagePage } from './MatchMessagePage';

type MatchPageBoundaryProps = {
  children: ReactNode;
  errorState: MatchMessageState;
  loadingState: MatchMessageState;
};

export const MatchPageBoundary = ({
  children,
  errorState,
  loadingState,
}: MatchPageBoundaryProps): ReactElement => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={({ error }) => (
            <MatchMessagePage
              pageState={{
                ...errorState,
                message: getApiErrorMessage(error, errorState.message),
              }}
            />
          )}
          onReset={reset}
        >
          <Suspense fallback={<MatchMessagePage pageState={loadingState} />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
