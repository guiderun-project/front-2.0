import { Suspense, type ReactElement, type ReactNode } from 'react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ErrorBoundary } from '@/components';

import type { AttendanceMessageState } from '../attendancePageState';
import { AttendanceMessagePage } from './AttendanceMessagePage';

type AttendancePageBoundaryProps = {
  children: ReactNode;
  errorState: AttendanceMessageState;
  handleBack: () => void;
  loadingState: AttendanceMessageState;
};

export const AttendancePageBoundary = ({
  children,
  errorState,
  handleBack,
  loadingState,
}: AttendancePageBoundaryProps): ReactElement => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={
            <AttendanceMessagePage
              handleBack={handleBack}
              pageState={errorState}
            />
          }
          onReset={reset}
        >
          <Suspense
            fallback={
              <AttendanceMessagePage
                handleBack={handleBack}
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
