import { useEffect, useRef, useState, type ReactElement } from 'react';

import { HiddenText } from '../HiddenText';
import { useAnnouncedMessage } from './hooks/useAnnouncedMessage';
import { useMissingRunningDistance } from './hooks/useMissingRunningDistance';
import { RunningRecordSheet } from './RunningRecordSheet';

export const RunningRecordGate = (): ReactElement => {
  const { data } = useMissingRunningDistance();

  const target = data?.items[0];
  const isSheetOpen = target !== undefined;

  // 저장 성공 안내는 시트(모달)가 닫혀 바깥 콘텐츠의 aria-hidden이 풀린 뒤에
  // 상시 마운트된 리전으로 낭독해야 유실되지 않는다.
  const hasPendingSaveRef = useRef(false);
  const [success, setSuccess] = useState({ message: '', revision: 0 });
  const announcedSuccessMessage = useAnnouncedMessage(
    success.message,
    success.revision,
  );

  useEffect(() => {
    if (!isSheetOpen && hasPendingSaveRef.current) {
      hasPendingSaveRef.current = false;
      setSuccess((previous) => ({
        message: '러닝 기록을 저장했어요',
        revision: previous.revision + 1,
      }));
    }
  }, [isSheetOpen]);

  return (
    <>
      <HiddenText role="status">{announcedSuccessMessage}</HiddenText>
      {target ? (
        <RunningRecordSheet
          key={target.eventId}
          eventId={target.eventId}
          eventName={target.name}
          onSaved={() => {
            hasPendingSaveRef.current = true;
          }}
        />
      ) : null}
    </>
  );
};
