import { useEffect, useState } from 'react';

type KeyboardInsetMetrics = {
  enabled: boolean;
  hasKeyboardTarget: boolean;
  innerHeight: number;
  viewportHeight: number;
  viewportOffsetTop: number;
};

const NON_KEYBOARD_INPUT_TYPES = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

const resolveKeyboardInset = ({
  enabled,
  hasKeyboardTarget,
  innerHeight,
  viewportHeight,
  viewportOffsetTop,
}: KeyboardInsetMetrics): number => {
  if (!enabled || !hasKeyboardTarget) {
    return 0;
  }

  const nextInset = innerHeight - viewportHeight - viewportOffsetTop;

  return nextInset > 0 ? nextInset : 0;
};

const isKeyboardTarget = (element: Element | null): boolean => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.isContentEditable) {
    return true;
  }

  if (element instanceof HTMLTextAreaElement) {
    return true;
  }

  if (!(element instanceof HTMLInputElement)) {
    return false;
  }

  return !NON_KEYBOARD_INPUT_TYPES.has(element.type);
};

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

      setInset(
        resolveKeyboardInset({
          enabled,
          hasKeyboardTarget: isKeyboardTarget(document.activeElement),
          innerHeight: window.innerHeight,
          viewportHeight: viewport.height,
          viewportOffsetTop: viewport.offsetTop,
        }),
      );
    };

    update();

    if (!enabled || !viewport) {
      return;
    }

    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
    };
  }, [enabled]);

  return inset;
};
