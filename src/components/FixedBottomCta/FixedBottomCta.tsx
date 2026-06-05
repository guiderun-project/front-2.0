import { useEffect, useRef, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { FixedBottomCtaProps } from './FixedBottomCta.types';

const DEFAULT_RESERVE_SPACE = true;

export const FixedBottomCta = ({
  children,
  reserveSpace = DEFAULT_RESERVE_SPACE,
  ...props
}: FixedBottomCtaProps): ReactElement => {
  const footerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {reserveSpace ? <Spacer ref={spacerRef} aria-hidden="true" /> : null}
      <FixedArea ref={footerRef} {...props}>
        {children}
      </FixedArea>
    </>
  );
};

const Spacer = styled.div({
  height: 0,
  pointerEvents: 'none',
});

const FixedArea = styled.footer(({ theme }) => ({
  position: 'fixed',
  right: '50%',
  bottom: 0,
  zIndex: theme.zIndex.control,
  display: 'grid',
  boxSizing: 'border-box',
  width: `min(100%, var(--app-mobile-viewport-width, ${theme.pxToRem(430)}))`,
  padding: `${theme.spacing.lg} ${theme.spacing.none} calc(${theme.spacing.lg} + env(safe-area-inset-bottom))`,
  gap: theme.spacing.md,
  transform: 'translateX(50%)',
}));
