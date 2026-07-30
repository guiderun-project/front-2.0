import { useEffect, useRef, useState, type ReactElement } from 'react';

import { useAuth } from '@/contexts';
import { useAnnouncedMessage } from '@/hooks/useAnnouncedMessage';

import { HiddenText } from '../HiddenText';
import { BirthDateSheet } from './BirthDateSheet';

export const BirthDateGate = (): ReactElement => {
  const { isAuthReady, user } = useAuth();
  const sheetUser =
    isAuthReady && user !== null && user.birthDate === null ? user : null;
  const isSheetOpen = sheetUser !== null;

  // 등록 성공 안내는 시트(모달)가 닫혀 바깥 콘텐츠의 aria-hidden이 풀린 뒤에
  // 상시 마운트된 리전으로 낭독해야 유실되지 않는다.
  const hasPendingSuccessRef = useRef(false);
  const [success, setSuccess] = useState({ message: '', revision: 0 });
  const announcedSuccessMessage = useAnnouncedMessage(
    success.message,
    success.revision,
  );

  useEffect(() => {
    if (!isSheetOpen && hasPendingSuccessRef.current) {
      hasPendingSuccessRef.current = false;
      setSuccess((previous) => ({
        message: '생년월일을 등록했어요',
        revision: previous.revision + 1,
      }));
    }
  }, [isSheetOpen]);

  return (
    <>
      {/*
        data-live-announcer: 생년월일 등록 직후 러닝기록 시트(모달)가 곧바로 열리면
        react-aria ModalOverlay의 ariaHideOutside가 모달 밖 요소를 aria-hidden 처리해
        성공 안내가 유실된다. 이 속성이 있는 요소만 숨김 대상에서 제외된다.
        (ToastViewport와 동일한 react-aria 비공개 규약 사용 — 업그레이드 시 회귀 확인 필요)
      */}
      <HiddenText data-live-announcer="true" role="status">
        {announcedSuccessMessage}
      </HiddenText>
      {sheetUser !== null ? (
        <BirthDateSheet
          userName={sheetUser.name}
          onRegistered={() => {
            hasPendingSuccessRef.current = true;
          }}
        />
      ) : null}
    </>
  );
};
