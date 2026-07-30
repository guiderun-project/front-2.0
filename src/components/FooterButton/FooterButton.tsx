import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  useEffect,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import styled from '@emotion/styled';

import { useKeyboardInset } from '@/hooks/useKeyboardInset';

import { Button, ButtonGroup } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';
import type {
  FooterButtonBackground,
  FooterButtonNoticeProps,
  FooterButtonProps,
} from './FooterButton.types';

const DEFAULT_BACKGROUND = 'footer' satisfies FooterButtonBackground;
const DEFAULT_RESERVE_SPACE = true;

const isFooterButtonElement = (child: ReactNode): child is ReactElement =>
  isValidElement(child) && child.type === Button;

const FooterButtonNotice = ({
  children,
  ...props
}: FooterButtonNoticeProps): ReactElement => {
  return (
    <NoticeContainer {...props}>
      <Icon aria-hidden={true} color="icon.tertiary" icon="lock-filled" size={20} />
      <NoticeText as="p" color="text.secondary" font="body-m-sb">
        {children}
      </NoticeText>
    </NoticeContainer>
  );
};

const isFooterButtonNoticeElement = (
  child: ReactNode,
): child is ReactElement<ComponentPropsWithoutRef<typeof FooterButtonNotice>> =>
  isValidElement(child) && child.type === FooterButtonNotice;

const FooterButtonRoot = ({
  background = DEFAULT_BACKGROUND,
  children,
  ratio,
  reserveSpace = DEFAULT_RESERVE_SPACE,
  ...props
}: FooterButtonProps): ReactElement | null => {
  const footerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const keyboardInset = useKeyboardInset(true);
  const footerItems = Children.toArray(children);
  const buttons = footerItems.filter(isFooterButtonElement);
  const notices = footerItems.filter(isFooterButtonNoticeElement);
  const buttonCount = buttons.length;
  const hasNotice = notices.length === 1 && buttonCount === 0;
  const hasButtons = notices.length === 0 && buttonCount >= 1 && buttonCount <= 2;

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

  if (!hasNotice && !hasButtons) {
    return null;
  }

  return (
    <>
      {reserveSpace ? <Spacer ref={spacerRef} aria-hidden="true" /> : null}
      <FixedArea
        ref={footerRef}
        $background={background}
        $keyboardInset={keyboardInset}
        {...props}
      >
        {hasNotice ? notices[0] : <ButtonGroup ratio={ratio}>{buttons}</ButtonGroup>}
      </FixedArea>
    </>
  );
};

const Spacer = styled.div({
  height: 0,
  pointerEvents: 'none',
});

const FixedArea = styled.footer<{
  $background: FooterButtonBackground;
  $keyboardInset: number;
}>(
  ({ $background, $keyboardInset, theme }) => ({
    position: 'fixed',
    right: '50%',
    bottom: $keyboardInset ? `${$keyboardInset}px` : 0,
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

const NoticeContainer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '100%',
  gap: theme.spacing.md,
  overflow: 'hidden',
  padding: `${theme.spacing.sm} ${theme.spacing['3xl']}`,
  borderRadius: theme.radius.full,
}));

const NoticeText = styled(Text)({
  display: 'block',
  overflow: 'hidden',
  minWidth: 0,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordBreak: 'break-word',
});

export const FooterButton = Object.assign(FooterButtonRoot, {
  Button,
  Notice: FooterButtonNotice,
});
