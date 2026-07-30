import type { ReactNode, RefObject } from "react";
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
 *
 * 낭독 채널 단일화: 제출 검증 실패처럼 "오류 등장 시엔 비포커스였다가 곧바로
 * 해당 컨트롤로 프로그램 포커스가 이동해 오는 흐름"에서는 포커스 시
 * aria-describedby가 같은 오류를 낭독하므로 미러 주입을 생략한다. 이를 위해
 * (1) 오류가 나타난 시점에 컨트롤이 포커스 상태였는지(hadFocusAtError) 기록하고,
 * (2) 주입을 이중 rAF로 지연시켜 호출측의 포커스 이동 rAF보다 뒤에 실행되게 한 뒤,
 * (3) 주입 시점에 포커스가 컨트롤로 옮겨와 있으면 건너뛴다.
 * 타이핑 중 오류(이미 포커스된 상태에서 오류 등장)는 describedby가 재낭독되지
 * 않으므로 기존대로 미러가 낭독한다.
 *
 * @param controlRef 오류가 연결된 컨트롤(또는 세그먼트들을 감싼 컨테이너) ref.
 *   생략하면 검증-포커스 흐름 가드 없이 항상 미러링한다.
 */
export const useFieldErrorAnnouncement = (
  errorText: ReactNode,
  controlRef?: RefObject<HTMLElement | null>,
): string => {
  // JSX 오류 메시지는 렌더마다 참조가 바뀌어 반복 낭독을 유발할 수 있으므로
  // 문자열/숫자 메시지만 안내한다. (현재 모든 사용처가 문자열)
  const message =
    typeof errorText === "string" || typeof errorText === "number"
      ? String(errorText)
      : "";

  const [announcedMessage, setAnnouncedMessage] = useState("");

  useEffect(() => {
    const isControlFocused = (): boolean => {
      const control = controlRef?.current;
      const active = document.activeElement;
      return Boolean(
        control && active && (control === active || control.contains(active)),
      );
    };
    const hadFocusAtError = isControlFocused();

    // 오류가 사라질 때(message === "")도 rAF로 리전을 비워 두어야, 같은 오류가
    // 다시 나타났을 때 빈 문자열을 거친 내용 변경으로 재낭독이 보장된다.
    let innerFrameId: number | null = null;
    const outerFrameId = window.requestAnimationFrame(() => {
      innerFrameId = window.requestAnimationFrame(() => {
        // 검증-포커스 흐름: describedby가 낭독 채널이므로 미러 주입을 생략한다.
        if (message !== "" && !hadFocusAtError && isControlFocused()) {
          setAnnouncedMessage("");
          return;
        }
        setAnnouncedMessage(message);
      });
    });

    return () => {
      window.cancelAnimationFrame(outerFrameId);
      if (innerFrameId != null) {
        window.cancelAnimationFrame(innerFrameId);
      }
    };
  }, [message, controlRef]);

  return announcedMessage;
};
