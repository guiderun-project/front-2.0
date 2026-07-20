import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { useBlocker } from 'react-router-dom';

export type UseRouteBlockerConfirmOptions = {
  /** 라우트 이탈 차단 활성화 여부 */
  enabled: boolean;
  /**
   * '머무르기' 선택(blocker.reset()) 후 포커스가 body로 떨어졌을 때 복귀시킬 요소.
   * 브라우저 뒤로가기(POP)로 차단된 경우 다이얼로그를 연 기준 요소가 없어
   * 다이얼로그가 닫히면 스크린리더 탐색 위치가 페이지 상단으로 초기화되므로,
   * 폼 영역 제목처럼 작성 맥락을 알려주는 요소를 지정한다.
   * (필요 시 훅이 tabindex="-1"을 직접 부여하므로 포커스 가능 요소가 아니어도 된다.)
   */
  fallbackFocusRef?: RefObject<HTMLElement | null>;
  /**
   * 라우트 이탈 시 실행할 확인 함수로, 이 함수를 통해 커스텀 다이얼로그 사용 가능
   * true 반환 시 이동 허용, false 반환 시 이동 차단
   * useCallback으로 감싸서 전달해야 effect 재실행을 방지할 수 있음 */
  onConfirm: () => Promise<boolean>;
};

/**
 * '머무르기' 선택 후 다이얼로그 언마운트와 react-aria FocusScope의 포커스 복원이
 * 끝난 뒤에도 포커스가 body에 남아 있으면(주로 POP 차단 케이스) 저장해 둔 요소나
 * fallback 요소로 포커스를 복귀시킨다. 닫기 버튼 경유처럼 react-aria가 이미
 * 복귀시킨 경우에는 개입하지 않는다.
 */
const restoreFocusAfterReset = (
  previousActiveElement: HTMLElement | null,
  fallbackElement: HTMLElement | null,
) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const activeElement = document.activeElement;
      if (activeElement !== null && activeElement !== document.body) return;

      const isPreviousElementUsable =
        previousActiveElement !== null && previousActiveElement.isConnected;
      const target = isPreviousElementUsable
        ? previousActiveElement
        : fallbackElement;

      if (!target || !target.isConnected) return;

      // 자연 포커스 불가 요소(제목 등)에만 tabindex를 부여한다.
      // 버튼처럼 이미 포커스 가능한 요소에 tabindex="-1"을 주면 탭 순서에서 빠진다.
      if (!target.hasAttribute('tabindex') && target.tabIndex < 0) {
        target.setAttribute('tabindex', '-1');
      }

      target.focus({ preventScroll: true });
    });
  });
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
  fallbackFocusRef,
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

      // POP(뒤로가기 제스처) 차단 시에는 activeElement가 body인 경우가 많다.
      // 다이얼로그를 열기 전의 포커스 요소를 저장해 '머무르기' 후 복귀에 사용한다.
      const activeElementBeforeConfirm = document.activeElement;
      const previousActiveElement =
        activeElementBeforeConfirm instanceof HTMLElement &&
        activeElementBeforeConfirm !== document.body
          ? activeElementBeforeConfirm
          : null;

      const isConfirmed = await onConfirm();

      if (isConfirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
        restoreFocusAfterReset(
          previousActiveElement,
          fallbackFocusRef?.current ?? null,
        );
      }

      isConfirmingRef.current = false;
    };

    run();
  }, [blocker, fallbackFocusRef, onConfirm]);

  return { allowNavigation };
};
