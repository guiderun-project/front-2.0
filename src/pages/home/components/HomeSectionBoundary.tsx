import { Suspense, type ReactElement, type ReactNode } from 'react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { Button, ErrorBoundary } from '@/components';

import { HomeSectionMessage } from './HomeSectionMessage';

type HomeSectionBoundaryProps = {
  loadingMessage: string;
  errorMessage: string;
  children: ReactNode;
};

/**
 * 홈 섹션을 Suspense + ErrorBoundary로 감싸는 경계.
 * 로딩은 Suspense fallback, 에러는 ErrorBoundary fallback으로 처리하고,
 * react-query의 reset과 연결해 재시도를 지원한다.
 */
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
