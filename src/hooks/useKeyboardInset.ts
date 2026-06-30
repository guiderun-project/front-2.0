import { useEffect, useState } from 'react';

// 모바일 키보드가 올라오면 visualViewport 높이가 줄어든다. 레이아웃 뷰포트(100dvh)는
// 그대로라 position: fixed 요소는 키보드에 가려질 수 있다. 줄어든 만큼을 인셋으로 돌려준다.
export const useKeyboardInset = (enabled: boolean): number => {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;

    const update = () => {
      if (!enabled || !viewport) {
        setInset(0);

        return;
      }

      const nextInset =
        window.innerHeight - viewport.height - viewport.offsetTop;

      setInset(nextInset > 0 ? nextInset : 0);
    };

    update();

    if (!enabled || !viewport) {
      return;
    }

    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, [enabled]);

  return inset;
};
