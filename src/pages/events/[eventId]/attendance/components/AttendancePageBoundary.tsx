import { Suspense, type ReactElement, type ReactNode } from 'react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ErrorBoundary } from '@/components';

import type { AttendanceMessageState } from '../attendancePageState';
import { AttendanceMessagePage } from './AttendanceMessagePage';

type AttendancePageBoundaryProps = {
  children: ReactNode;
  errorState: AttendanceMessageState;
  loadingState: AttendanceMessageState;
  onBack: () => void;
};

export const AttendancePageBoundary = ({
  children,
  errorState,
  loadingState,
  onBack,
}: AttendancePageBoundaryProps): ReactElement => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={
            <AttendanceMessagePage
              onBack={onBack}
              pageState={errorState}
            />
          }
          onReset={reset}
        >
          <Suspense
            fallback={
              <AttendanceMessagePage
                onBack={onBack}
                pageState={loadingState}
              />
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
