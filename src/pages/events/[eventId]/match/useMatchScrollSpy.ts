import { useEffect, useRef, useState } from 'react';

import type { MatchSectionId } from './matchPageState';

const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
  let current = element?.parentElement ?? null;

  while (current) {
    const { overflowY } = window.getComputedStyle(current);

    if (overflowY === 'auto' || overflowY === 'scroll') {
      return current;
    }

    current = current.parentElement;
  }

  return null;
};

/**
 * 매칭대기/매칭완료 섹션이 하나의 스크롤에 함께 놓인 구조에서,
 * sticky 세그먼트가 현재 위치를 하이라이트(스크롤 스파이)하고
 * 세그먼트 클릭 시 해당 섹션으로 스크롤하도록 돕는다.
 */
export const useMatchScrollSpy = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const waitingRef = useRef<HTMLElement>(null);
  const completedRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<MatchSectionId>('waiting');

  useEffect(() => {
    const container = getScrollParent(waitingRef.current);

    if (!container) {
      return;
    }

    let frameId: number | null = null;

    const updateActiveSection = () => {
      frameId = null;
      const completed = completedRef.current;

      if (!completed) {
        return;
      }

      const navHeight = navRef.current?.offsetHeight ?? 0;
      const containerTop = container.getBoundingClientRect().top + navHeight;
      const completedTop = completed.getBoundingClientRect().top;

      setActiveSection(completedTop <= containerTop + 1 ? 'completed' : 'waiting');
    };

    const requestUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    container.addEventListener('scroll', requestUpdate, { passive: true });

    return () => {
      container.removeEventListener('scroll', requestUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const scrollToSection = (sectionId: MatchSectionId) => {
    const target =
      sectionId === 'waiting' ? waitingRef.current : completedRef.current;
    const container = getScrollParent(target);

    if (!target || !container) {
      return;
    }

    const navHeight = navRef.current?.offsetHeight ?? 0;
    const nextTop =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      navHeight;

    container.scrollTo({
      behavior: 'smooth',
      top: Math.max(nextTop, 0),
    });
  };

  return {
    activeSection,
    completedRef,
    navRef,
    scrollToSection,
    waitingRef,
  };
};
