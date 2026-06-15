import { Suspense, type ReactElement, type ReactNode } from "react";

import styled from "@emotion/styled";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { Button } from "@/components/Button";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type QueryBoundaryProps = {
  loadingMessage: string;
  errorMessage: string;
  children: ReactNode;
};

/**
 * Suspense + ErrorBoundary를 묶어 데이터 영역의 로딩/에러를 처리하는 경계.
 * react-query의 reset과 연결해 재시도를 지원한다.
 */
export const QueryBoundary = ({
  children,
  errorMessage,
  loadingMessage,
}: QueryBoundaryProps): ReactElement => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={({ reset: retry }) => (
            <Message role="alert">
              {errorMessage}
              <Button level="secondary" size="s" type="button" onClick={retry}>
                다시 시도
              </Button>
            </Message>
          )}
        >
          <Suspense
            fallback={<Message role="status">{loadingMessage}</Message>}
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

const Message = styled.p(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing.md,
  minHeight: theme.pxToRem(160),
  margin: 0,
  color: theme.color.text.tertiary,
  textAlign: "center",
  ...theme.typography["body-m-m"],
}));
