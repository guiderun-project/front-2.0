import { useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

export type UseRouteBlockerConfirmOptions = {
  /** 라우트 이탈 차단 활성화 여부 */
  enabled: boolean;
  /** 라우트 이탈 시 실행할 확인 함수. true 반환 시 이동 허용, false 반환 시 이동 차단 */
  onConfirm: () => Promise<boolean>;
};

/**
 * 라우트 이탈 시 확인 다이얼로그를 표시하는 훅
 * - 브라우저 뒤로가기/새로고침 시에도 동작
 * - onConfirm 함수를 통해 커스텀 다이얼로그 사용 가능
 * - onConfirm은 useCallback으로 감싸서 전달해야 effect 재실행을 방지할 수 있음
 */
export const useRouteBlockerConfirm = ({ enabled, onConfirm }: UseRouteBlockerConfirmOptions) => {
  const isConfirmingRef = useRef(false);

  const blocker = useBlocker(() => enabled);

  // 브라우저 새로고침/창닫기 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabled) return;
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);

  // 차단 시 커스텀 Confirm 표시
  useEffect(() => {
    const run = async () => {
      if (blocker.state !== 'blocked') return;
      if (isConfirmingRef.current) return;
      isConfirmingRef.current = true;

      const isConfirmed = await onConfirm();

      if (isConfirmed) blocker.proceed();
      else blocker.reset();

      isConfirmingRef.current = false;
    };

    run();
  }, [blocker, onConfirm]);
};
