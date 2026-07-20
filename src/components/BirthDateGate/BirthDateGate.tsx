import { useEffect, useRef, useState, type ReactElement } from 'react';

import { useAuth } from '@/contexts';

import { HiddenText } from '../HiddenText';
import { BirthDateSheet } from './BirthDateSheet';
import { useAnnouncedMessage } from './useAnnouncedMessage';

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
      <HiddenText role="status">{announcedSuccessMessage}</HiddenText>
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
