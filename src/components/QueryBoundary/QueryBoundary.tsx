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
import { useLocation, useNavigate } from "react-router-dom";

import { getApiErrorMessage, isUnauthorizedApiError } from "@/api/core";
import { Button } from "@/components/Button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HiddenText } from "@/components/HiddenText";
import { APP_PATH } from "@/router/path";

type QueryBoundaryProps = {
  loadingMessage: string;
  errorMessage: string;
  /**
   * 로딩 완료 시 스크린리더에 낭독할 문구예요. 한 화면에 QueryBoundary가
   * 여러 개라면 "활동 요약을 불러왔어요."처럼 대상 컨텍스트를 담아 주세요.
   */
  completionMessage?: string;
  children: ReactNode;
};

const DEFAULT_COMPLETION_MESSAGE = "불러왔어요.";
// 낭독이 끝난 완료 문구가 가상 커서 탐색에 잔존하지 않도록 비우는 지연
// (Loader의 완료 리전 제거 3초와 동일한 관례).
const COMPLETION_MESSAGE_CLEAR_DELAY_MS = 3000;

export const QueryBoundary = ({
  children,
  completionMessage = DEFAULT_COMPLETION_MESSAGE,
  errorMessage,
  loadingMessage,
}: QueryBoundaryProps): ReactElement => {
  const loadingMessageRef = useRef<HTMLParagraphElement>(null);
  const completionFrameRef = useRef<number | null>(null);
  const completionClearTimerRef = useRef<number | null>(null);
  // 완료 안내용 라이브 리전은 항상 마운트해 두고 텍스트만 갈아끼운다.
  const [completionAnnouncement, setCompletionAnnouncement] = useState("");

  const cancelScheduledCompletion = useCallback(() => {
    if (completionFrameRef.current !== null) {
      window.cancelAnimationFrame(completionFrameRef.current);
      completionFrameRef.current = null;
    }
    if (completionClearTimerRef.current !== null) {
      window.clearTimeout(completionClearTimerRef.current);
      completionClearTimerRef.current = null;
    }
  }, []);

  // 로딩이 새로 시작되거나 오류로 전환되면 완료 안내가 나가지 않도록 비운다.
  // 비워 두면 같은 문자열이라도 다음 완료 시 다시 낭독된다 (iOS VO 방어).
  const clearCompletionAnnouncement = useCallback(() => {
    cancelScheduledCompletion();
    setCompletionAnnouncement("");
  }, [cancelScheduledCompletion]);

  const scheduleCompletionAnnouncement = useCallback(() => {
    cancelScheduledCompletion();
    completionFrameRef.current = window.requestAnimationFrame(() => {
      completionFrameRef.current = null;
      setCompletionAnnouncement(completionMessage);
      // 낭독 후에는 문구를 비워 잔존 텍스트가 읽히지 않게 한다.
      completionClearTimerRef.current = window.setTimeout(() => {
        completionClearTimerRef.current = null;
        setCompletionAnnouncement("");
      }, COMPLETION_MESSAGE_CLEAR_DELAY_MS);
    });
  }, [cancelScheduledCompletion, completionMessage]);

  const handleRetry = useCallback((retry: () => void) => {
    retry();
    // 재시도로 오류 fallback(포커스된 버튼)이 언마운트되면 포커스가 body로
    // 떨어지므로, 로딩 메시지로 옮겨 SR 커서 초기화를 막고 재시도 시작을
    // 안내한다. 키보드(Enter) 경로에서 생길 수 있는 UA 기본 포커스 링은
    // Message의 "&:focus" outline 제거로 표시되지 않는다.
    window.requestAnimationFrame(() => {
      loadingMessageRef.current?.focus();
    });
  }, []);

  useEffect(() => cancelScheduledCompletion, [cancelScheduledCompletion]);

  return (
    <>
      <HiddenText role="status">{completionAnnouncement}</HiddenText>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallback={({ error, reset: retry }) => (
              <QueryErrorFallback
                isUnauthorized={isUnauthorizedApiError(error)}
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
// 낭독이 누락되기 쉬우므로 이중 구조를 쓴다. 보이는 텍스트는 즉시 렌더하되
// aria-hidden으로 낭독에서 제외하고(시각 디자인 불변), 스크린리더용 텍스트만
// SR 전용 status 리전에 다음 프레임에 주입해 낭독 신뢰성을 확보한다.
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

  // 재시도 포커스(handleRetry)가 이 요소로 오므로, 낭독을 담당하는 status
  // 리전은 반드시 포커스되는 Message 내부에 둔다.
  return (
    <Message ref={messageRef} tabIndex={-1}>
      <span aria-hidden={true}>{message}</span>
      <HiddenText role="status">{announcedMessage}</HiddenText>
    </Message>
  );
};

type QueryErrorFallbackProps = {
  isUnauthorized: boolean;
  message: string;
  onMount: () => void;
  onRetry: () => void;
};

const QueryErrorFallback = ({
  isUnauthorized,
  message,
  onMount,
  onRetry,
}: QueryErrorFallbackProps): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <Message role="alert">
      {message}
      {isUnauthorized ? (
        <Button
          level="secondary"
          size="s"
          type="button"
          onClick={() =>
            navigate(APP_PATH.LOGIN, { state: { from: location } })
          }
        >
          로그인하기
        </Button>
      ) : (
        <Button level="secondary" size="s" type="button" onClick={onRetry}>
          다시 시도
        </Button>
      )}
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
  // 비인터랙티브 프로그래매틱 포커스 싱크라 가시 포커스 표시 대상이 아니므로,
  // 포커스 링이 시각적으로 드러나지 않게 한다 (App.tsx의 main 포커스와 동일 취지).
  "&:focus": {
    outline: "none",
  },
}));
