import { Suspense, type ReactElement, type ReactNode } from 'react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ErrorBoundary } from '@/components';

import type { AttendanceMessageState } from '../attendancePageState';
import { AttendanceMessagePage } from './AttendanceMessagePage';

type AttendancePageBoundaryProps = {
  children: ReactNode;
  errorState: AttendanceMessageState;
  loadingState: AttendanceMessageState;
};

export const AttendancePageBoundary = ({
  children,
  errorState,
  loadingState,
}: AttendancePageBoundaryProps): ReactElement => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={
            <AttendanceMessagePage pageState={errorState} />
          }
          onReset={reset}
        >
          <Suspense
            fallback={
              <AttendanceMessagePage pageState={loadingState} />
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
