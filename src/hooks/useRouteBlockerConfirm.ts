import { useCallback, useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

export type UseRouteBlockerConfirmOptions = {
  /** 라우트 이탈 차단 활성화 여부 */
  enabled: boolean;
  /**
   * 라우트 이탈 시 실행할 확인 함수로, 이 함수를 통해 커스텀 다이얼로그 사용 가능
   * true 반환 시 이동 허용, false 반환 시 이동 차단
   * useCallback으로 감싸서 전달해야 effect 재실행을 방지할 수 있음 */
  onConfirm: () => Promise<boolean>;
};

/**
 * 라우트 이탈 시 확인 다이얼로그를 표시하는 훅. 브라우저 뒤로가기/새로고침 시에도 동작
 *
 * 반환하는 `allowNavigation`을 호출하면 이후 이탈을 차단하지 않는다.
 * 저장 완료처럼 의도된 이동 직전에 호출한다. `enabled`는 렌더 시점 값이라
 * 제출 성공 직후처럼 리렌더 전에 이동하면 이전 값으로 차단될 수 있기 때문.
 */
export const useRouteBlockerConfirm = ({
  enabled,
  onConfirm,
}: UseRouteBlockerConfirmOptions) => {
  const isConfirmingRef = useRef(false);
  const isNavigationAllowedRef = useRef(false);

  const blocker = useBlocker(() => enabled && !isNavigationAllowedRef.current);

  const allowNavigation = useCallback(() => {
    isNavigationAllowedRef.current = true;
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabled || isNavigationAllowedRef.current) return;
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);

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

  return { allowNavigation };
};
