import { Suspense, type ReactElement, type ReactNode } from "react";

import styled from "@emotion/styled";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { Button, ErrorBoundary } from "@/components";

type EventsBoundaryProps = {
  children: ReactNode;
};

export const EventsBoundary = ({
  children,
}: EventsBoundaryProps): ReactElement => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={({ reset: retry }) => (
            <StateMessage role="alert">
              모임을 불러오지 못했어요.
              <Button level="secondary" size="s" type="button" onClick={retry}>
                다시 시도
              </Button>
            </StateMessage>
          )}
        >
          <Suspense
            fallback={
              <StateMessage role="status">
                모임을 불러오는 중이에요.
              </StateMessage>
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

const StateMessage = styled.p(({ theme }) => ({
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
