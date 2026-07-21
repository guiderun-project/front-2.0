import { useEffect, useState } from 'react';

const ANNOUNCE_DELAY_MS = 150;

// 상시 마운트된 라이브 리전에 넣을 메시지를 지연 주입한다.
// 리전을 빈 상태로 먼저 렌더한 뒤 잠시 후 텍스트를 채워야 iOS VoiceOver 와
// Android TalkBack 이 변경을 안정적으로 낭독하고, 같은 문자열 반복 안내는
// revision 증가로 재주입을 트리거한다.
// (@/hooks/useAnnouncedMessage 와 동일 구현의 페이지 로컬 복제 — 공용 정리 시 함께 승격한다)
export const useAnnouncedMessage = (
  message: string,
  revision: number,
): string => {
  const [announcedMessage, setAnnouncedMessage] = useState('');

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedMessage('');
    });
    const timeoutId = window.setTimeout(() => {
      setAnnouncedMessage(message);
    }, ANNOUNCE_DELAY_MS);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [message, revision]);

  return announcedMessage;
};
