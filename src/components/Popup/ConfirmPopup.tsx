import { useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';

import styled from '@emotion/styled';

import { Button } from '@/components/Button';
import { HiddenText } from '@/components/HiddenText';
import { Text } from '@/components/Text';

import { Popup } from './Popup';
import { CONFIRM_POPUP_INITIAL_FOCUS } from './ConfirmPopup.types';
import type { ConfirmPopupInitialFocus, ConfirmPopupVariant } from './ConfirmPopup.types';

type ConfirmPopupProps = {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmPopupVariant;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  cancelDisabled?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  initialFocus?: ConfirmPopupInitialFocus;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export const ConfirmPopup = ({
  cancelDisabled = false,
  cancelText = '취소',
  className,
  closeOnBackdropClick = false,
  closeOnEscape = true,
  confirmDisabled = false,
  confirmLoading = false,
  confirmText = '확인',
  description,
  initialFocus = CONFIRM_POPUP_INITIAL_FOCUS.CANCEL,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  subtitle,
  title,
}: ConfirmPopupProps): ReactElement => {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const isConfirmDisabled = confirmDisabled || confirmLoading;
  const [loadingMessage, setLoadingMessage] = useState('');

  // 초기 포커스는 팝업이 열리는 시점에만 지정한다. disabled 상태를 의존성에
  // 넣으면 확인 버튼이 로딩으로 비활성화될 때마다 이펙트가 재실행되어
  // 포커스가 취소 버튼으로 강제 이동하는 문제가 있었다.
  useEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const primaryTarget =
        initialFocus === CONFIRM_POPUP_INITIAL_FOCUS.CONFIRM
          ? confirmButtonRef.current
          : cancelButtonRef.current;
      const secondaryTarget =
        initialFocus === CONFIRM_POPUP_INITIAL_FOCUS.CONFIRM
          ? cancelButtonRef.current
          : confirmButtonRef.current;
      const target =
        (primaryTarget && !primaryTarget.disabled && primaryTarget) ||
        (secondaryTarget && !secondaryTarget.disabled && secondaryTarget) ||
        panelRef.current;

      target?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [initialFocus, open]);

  // aria-busy 변경은 스크린리더가 낭독하지 않으므로 처리 중 상태를 라이브
  // 리전으로 안내한다. 리전을 비운 뒤 다음 프레임에 텍스트를 주입해야
  // iOS VoiceOver/TalkBack에서 안정적으로 낭독되고, 로딩이 끝날 때도 rAF로
  // 비워 두어야 로딩이 반복될 때 빈 문자열을 거친 내용 변경으로 재낭독이
  // 보장된다.
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setLoadingMessage(confirmLoading ? '처리 중이에요' : '');
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [confirmLoading]);

  const handleCancel = () => {
    if (cancelDisabled) {
      return;
    }

    onOpenChange?.(false);
    onCancel();
  };

  const handleConfirm = () => {
    if (isConfirmDisabled) {
      return;
    }

    onConfirm();
  };

  return (
    <Popup
      ariaDescribedBy={description ? descriptionId : undefined}
      ariaLabelledBy={titleId}
      className={className}
      closeOnBackdropClick={!cancelDisabled && closeOnBackdropClick}
      closeOnEscape={!cancelDisabled && closeOnEscape}
      onClose={onCancel}
      onOpenChange={onOpenChange}
      open={open}
      role="alertdialog"
    >
      <Panel ref={panelRef} tabIndex={-1}>
        <Copy>
          <TitleGroup>
            {subtitle ? (
              <Text align="center" as="p" color="text.secondary" font="body-m-m">
                {subtitle}
              </Text>
            ) : null}
            <Text align="center" as="h2" color="text.primary" font="heading-s-sb" id={titleId}>
              {title}
            </Text>
          </TitleGroup>
          {description ? (
            <Text
              align="center"
              as="p"
              color="text.tertiary"
              font="body-m-m"
              id={descriptionId}
            >
              {description}
            </Text>
          ) : null}
        </Copy>
        <Actions>
          <Button
            ref={cancelButtonRef}
            disabled={cancelDisabled}
            fullWidth
            level="secondary"
            size="l"
            type="button"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            aria-busy={confirmLoading}
            disabled={isConfirmDisabled}
            fullWidth
            size="l"
            type="button"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </Actions>
        <HiddenText role="status">{loadingMessage}</HiddenText>
      </Panel>
    </Popup>
  );
};

const Panel = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing['3xl'],
  padding: theme.spacing['3xl'],
  border: `1px solid ${theme.color.border.subtle}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.bg.elevated,
  boxShadow: theme.effect['card-shadow'],
  outline: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const Copy = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.md,
}));

const TitleGroup = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.xs,
}));

const Actions = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing.md,
}));
