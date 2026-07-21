import { useEffect, useRef, useState, type ReactElement } from 'react';

import { useAnnouncedMessage } from '@/hooks/useAnnouncedMessage';

import { HiddenText } from '../HiddenText';
import { useMissingRunningDistance } from './hooks/useMissingRunningDistance';
import { RunningRecordSheet } from './RunningRecordSheet';

export const RunningRecordGate = (): ReactElement => {
  const { data } = useMissingRunningDistance();

  const target = data?.items[0];
  const targetEventId = target?.eventId;
  const isSheetOpen = target !== undefined;

  // 저장 성공 안내는 시트(모달)가 닫혀 바깥 콘텐츠의 aria-hidden이 풀린 뒤에
  // 상시 마운트된 리전으로 낭독해야 유실되지 않는다.
  const hasPendingSaveRef = useRef(false);
  const [success, setSuccess] = useState({ message: '', revision: 0 });
  const announcedSuccessMessage = useAnnouncedMessage(
    success.message,
    success.revision,
  );

  // 미입력 이벤트가 여러 개면 저장 성공 뒤에도 시트가 다음 이벤트로 계속 열려 있어
  // 바깥 리전이 모달의 aria-hidden에 가려진다. 이때는 시트 내부 리전으로 즉시 안내한다.
  const [sheetAnnouncement, setSheetAnnouncement] = useState({
    message: '',
    revision: 0,
  });

  useEffect(() => {
    if (targetEventId !== undefined && hasPendingSaveRef.current) {
      hasPendingSaveRef.current = false;
      setSheetAnnouncement((previous) => ({
        message: '러닝 기록을 저장했어요',
        revision: previous.revision + 1,
      }));
    }
  }, [targetEventId]);

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
      {/*
        data-live-announcer: 성공 안내 직후 다른 모달(BottomSheet/Popup)이 열리면
        react-aria ModalOverlay의 ariaHideOutside가 모달 밖 요소를 aria-hidden 처리해
        안내가 유실된다. 이 속성이 있는 요소만 숨김 대상에서 제외된다.
        (ToastViewport와 동일한 react-aria 비공개 규약 사용 — 업그레이드 시 회귀 확인 필요)
      */}
      <HiddenText data-live-announcer="true" role="status">
        {announcedSuccessMessage}
      </HiddenText>
      {target ? (
        <RunningRecordSheet
          eventId={target.eventId}
          eventName={target.name}
          savedAnnouncement={sheetAnnouncement}
          onSaved={() => {
            hasPendingSaveRef.current = true;
          }}
          onSkipped={() => {
            // 마지막 상호작용이 건너뛰기면 뒤늦은 저장 성공 안내가 나오지 않게 한다.
            hasPendingSaveRef.current = false;
          }}
        />
      ) : null}
    </>
  );
};
