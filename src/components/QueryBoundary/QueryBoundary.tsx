import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";

import styled from "@emotion/styled";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/api/core";
import { Button } from "@/components/Button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HiddenText } from "@/components/HiddenText";

type QueryBoundaryProps = {
  loadingMessage: string;
  errorMessage: string;
  children: ReactNode;
};

const LOADING_COMPLETE_MESSAGE = "불러왔어요.";

export const QueryBoundary = ({
  children,
  errorMessage,
  loadingMessage,
}: QueryBoundaryProps): ReactElement => {
  const loadingMessageRef = useRef<HTMLParagraphElement>(null);
  const completionFrameRef = useRef<number | null>(null);
  // 완료 안내용 라이브 리전은 항상 마운트해 두고 텍스트만 갈아끼운다.
  const [completionMessage, setCompletionMessage] = useState("");

  const cancelScheduledCompletion = useCallback(() => {
    if (completionFrameRef.current !== null) {
      window.cancelAnimationFrame(completionFrameRef.current);
      completionFrameRef.current = null;
    }
  }, []);

  // 로딩이 새로 시작되거나 오류로 전환되면 완료 안내가 나가지 않도록 비운다.
  // 비워 두면 같은 문자열이라도 다음 완료 시 다시 낭독된다 (iOS VO 방어).
  const clearCompletionAnnouncement = useCallback(() => {
    cancelScheduledCompletion();
    setCompletionMessage("");
  }, [cancelScheduledCompletion]);

  const scheduleCompletionAnnouncement = useCallback(() => {
    cancelScheduledCompletion();
    completionFrameRef.current = window.requestAnimationFrame(() => {
      completionFrameRef.current = null;
      setCompletionMessage(LOADING_COMPLETE_MESSAGE);
    });
  }, [cancelScheduledCompletion]);

  const handleRetry = useCallback((retry: () => void) => {
    retry();
    // 재시도로 오류 fallback(포커스된 버튼)이 언마운트되면 포커스가 body로
    // 떨어지므로, 로딩 메시지로 옮겨 SR 커서 초기화를 막고 재시도 시작을
    // 안내한다. 프로그래매틱 포커스라 시각적 변화는 없다.
    window.requestAnimationFrame(() => {
      loadingMessageRef.current?.focus();
    });
  }, []);

  useEffect(() => cancelScheduledCompletion, [cancelScheduledCompletion]);

  return (
    <>
      <HiddenText role="status">{completionMessage}</HiddenText>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallback={({ error, reset: retry }) => (
              <QueryErrorFallback
                message={getApiErrorMessage(error, errorMessage)}
                onMount={clearCompletionAnnouncement}
                onRetry={() => handleRetry(retry)}
              />
            )}
          >
            <Suspense
              fallback={
                <QueryLoadingMessage
                  message={loadingMessage}
                  messageRef={loadingMessageRef}
                  onLoadingEnd={scheduleCompletionAnnouncement}
                  onLoadingStart={clearCompletionAnnouncement}
                />
              }
            >
              {children}
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </>
  );
};

type QueryLoadingMessageProps = {
  message: string;
  messageRef: RefObject<HTMLParagraphElement | null>;
  onLoadingEnd: () => void;
  onLoadingStart: () => void;
};

// Suspense fallback이 텍스트를 담은 채 통째로 마운트되면 VoiceOver/TalkBack에서
// 낭독이 누락되기 쉬우므로, 빈 리전을 먼저 마운트한 뒤 다음 프레임에 메시지를
// 주입한다. 시각적으로는 1프레임 차이라 보이는 모습은 사실상 동일하다.
const QueryLoadingMessage = ({
  message,
  messageRef,
  onLoadingEnd,
  onLoadingStart,
}: QueryLoadingMessageProps): ReactElement => {
  const [announcedMessage, setAnnouncedMessage] = useState("");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedMessage(message);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [message]);

  // 언마운트는 로딩 완료(콘텐츠 표시 또는 오류 전환)를 의미한다. 오류 전환 시에는
  // 오류 fallback이 마운트되며 예약된 완료 안내를 취소한다.
  useEffect(() => {
    onLoadingStart();

    return onLoadingEnd;
  }, [onLoadingEnd, onLoadingStart]);

  return (
    <Message ref={messageRef} role="status" tabIndex={-1}>
      {announcedMessage}
    </Message>
  );
};

type QueryErrorFallbackProps = {
  message: string;
  onMount: () => void;
  onRetry: () => void;
};

const QueryErrorFallback = ({
  message,
  onMount,
  onRetry,
}: QueryErrorFallbackProps): ReactElement => {
  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <Message role="alert">
      {message}
      <Button level="secondary" size="s" type="button" onClick={onRetry}>
        다시 시도
      </Button>
    </Message>
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
