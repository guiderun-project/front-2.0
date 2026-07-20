import { useEffect, useState } from 'react';

const ANNOUNCE_DELAY_MS = 150;

/**
 * 상시 마운트된 라이브 리전에 넣을 메시지를 지연 주입한다.
 *
 * 리전을 빈 상태로 먼저 렌더한 뒤 잠시 후 텍스트를 채워야 iOS VoiceOver와
 * Android TalkBack이 변경을 안정적으로 낭독한다. 메시지가 바뀌면 먼저 비워서
 * 같은 문자열 재주입도 재낭독되게 하고, 메시지 변경 없이 같은 안내를
 * 반복해야 하면 revision을 증가시켜 재주입을 트리거한다.
 *
 * BirthDateGate/RunningRecordGate의 동일 구현을 페이지 로컬로 복제했다.
 * (공용 승격 시 함께 정리한다)
 */
export const useAnnouncedMessage = (message: string, revision = 0): string => {
  const [announcedMessage, setAnnouncedMessage] = useState('');

  useEffect(() => {
    // 같은 문자열을 다시 주입해도 재낭독되도록 한 프레임 먼저 리전을 비운다.
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
