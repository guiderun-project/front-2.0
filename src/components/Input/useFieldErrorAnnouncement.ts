import type { ReactNode } from "react";
import { useEffect, useState } from "react";

/**
 * 오류 메시지를 상시 마운트된 스크린리더 전용 라이브 리전에 미러링하기 위한
 * 안내 문자열을 만든다.
 *
 * aria-describedby는 필드에 포커스가 들어올 때만 낭독되므로, 입력 중이거나
 * 제출 직후처럼 포커스가 다른 곳에 있을 때 나타나는 오류는 라이브 리전으로
 * 알려야 한다. 라이브 리전은 빈 상태로 먼저 마운트한 뒤 다음 프레임에 텍스트를
 * 주입해야 iOS VoiceOver/TalkBack에서 안정적으로 낭독되고, 오류가 바뀌거나
 * 다시 나타날 때도 빈 문자열을 거쳐 재주입되어 재낭독이 보장된다.
 */
export const useFieldErrorAnnouncement = (errorText: ReactNode): string => {
  // JSX 오류 메시지는 렌더마다 참조가 바뀌어 반복 낭독을 유발할 수 있으므로
  // 문자열/숫자 메시지만 안내한다. (현재 모든 사용처가 문자열)
  const message =
    typeof errorText === "string" || typeof errorText === "number"
      ? String(errorText)
      : "";

  const [announcedMessage, setAnnouncedMessage] = useState("");

  useEffect(() => {
    // 오류가 사라질 때(message === "")도 rAF로 리전을 비워 두어야, 같은 오류가
    // 다시 나타났을 때 빈 문자열을 거친 내용 변경으로 재낭독이 보장된다.
    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedMessage(message);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [message]);

  return announcedMessage;
};
