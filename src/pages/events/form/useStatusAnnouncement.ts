import { useCallback, useEffect, useState } from 'react';

const ANNOUNCE_DELAY_MS = 150;

type AnnouncementRequest = {
  message: string;
  revision: number;
};

/**
 * 상시 마운트된 라이브 리전(HiddenText role="status")에 넣을 메시지를
 * 지연 주입한다.
 *
 * 리전을 빈 상태로 먼저 렌더한 뒤 잠시 후 텍스트를 채워야 iOS VoiceOver 와
 * Android TalkBack 이 변경을 안정적으로 낭독한다. iOS VoiceOver 는 동일
 * 문자열 재주입을 재낭독하지 않으므로, announce 호출마다 revision 을 올리고
 * 먼저 한 프레임 비운 뒤 다시 채워 같은 안내의 반복 낭독도 보장한다.
 */
export const useStatusAnnouncement = (): {
  announce: (message: string) => void;
  announcedMessage: string;
} => {
  const [request, setRequest] = useState<AnnouncementRequest>({
    message: '',
    revision: 0,
  });
  const [announcedMessage, setAnnouncedMessage] = useState('');

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedMessage('');
    });
    const timeoutId = window.setTimeout(() => {
      setAnnouncedMessage(request.message);
    }, ANNOUNCE_DELAY_MS);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [request]);

  const announce = useCallback((message: string) => {
    setRequest((previous) => ({
      message,
      revision: previous.revision + 1,
    }));
  }, []);

  return { announce, announcedMessage };
};
