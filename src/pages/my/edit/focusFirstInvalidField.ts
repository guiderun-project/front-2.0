import type { RefObject } from 'react';

/**
 * 저장 시도에서 검증에 실패했을 때 컨테이너 안의 첫 오류 필드로 포커스를 옮긴다.
 *
 * 오류 상태가 DOM(aria-invalid)에 반영된 다음 프레임에 옮겨야 하므로 rAF 로 미룬다.
 * 포커스가 도착하면 해당 필드의 aria-describedby 가 오류를 낭독하고, Input 오류
 * 미러(useFieldErrorAnnouncement)는 이 흐름의 중복 주입을 생략하므로 별도의 폼
 * 수준 안내는 두지 않는다. 회원가입 스텝 검증(src/pages/signup/index.tsx)과 같은 방식이다.
 */
export const focusFirstInvalidField = (
  containerRef: RefObject<HTMLElement | null>,
): void => {
  window.requestAnimationFrame(() => {
    containerRef.current
      ?.querySelector<HTMLElement>('input[aria-invalid="true"]')
      ?.focus();
  });
};
