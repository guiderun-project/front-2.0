import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import styled from '@emotion/styled';

import { Button, ButtonGroup } from '../Button';
import type { FooterButtonBackground, FooterButtonProps } from './FooterButton.types';

const DEFAULT_BACKGROUND = 'footer' satisfies FooterButtonBackground;
const DEFAULT_RESERVE_SPACE = true;

const isFooterButtonElement = (child: ReactNode): child is ReactElement =>
  isValidElement(child) && child.type === Button;

const FooterButtonRoot = ({
  background = DEFAULT_BACKGROUND,
  children,
  ratio,
  reserveSpace = DEFAULT_RESERVE_SPACE,
  ...props
}: FooterButtonProps): ReactElement | null => {
  const footerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const buttons = Children.toArray(children).filter(isFooterButtonElement);
  const buttonCount = buttons.length;

  useEffect(() => {
    if (!reserveSpace) {
      return;
    }

    const footer = footerRef.current;
    const spacer = spacerRef.current;
    if (!footer || !spacer) {
      return;
    }

    const updateReservedHeight = () => {
      const nextHeight = Math.ceil(footer.getBoundingClientRect().height);

      spacer.style.height = `${nextHeight}px`;
    };

    updateReservedHeight();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(updateReservedHeight);
    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [reserveSpace]);

  if (buttonCount < 1 || buttonCount > 2) {
    return null;
  }

  return (
    <>
      {reserveSpace ? <Spacer ref={spacerRef} aria-hidden="true" /> : null}
      <FixedArea ref={footerRef} $background={background} {...props}>
        <ButtonGroup ratio={ratio}>{buttons}</ButtonGroup>
      </FixedArea>
    </>
  );
};

const Spacer = styled.div({
  height: 0,
  pointerEvents: 'none',
});

const FixedArea = styled.footer<{ $background: FooterButtonBackground }>(
  ({ $background, theme }) => ({
    position: 'fixed',
    right: '50%',
    bottom: 0,
    zIndex: theme.zIndex.footer,
    display: 'grid',
    boxSizing: 'border-box',
    width: `min(100%, var(--app-mobile-viewport-width, ${theme.layout.mobileViewportMaxWidth}))`,
    background:
      $background === 'subtle'
        ? theme.gradient.bg['footer-subtle']
        : theme.gradient.bg.footer,
    padding: `${theme.spacing.lg} ${theme.spacing.none} calc(${theme.spacing.lg} + env(safe-area-inset-bottom))`,
    gap: theme.spacing.md,
    transform: 'translateX(50%)',
  }),
);

export const FooterButton = Object.assign(FooterButtonRoot, { Button });
