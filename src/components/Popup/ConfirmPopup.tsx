import { useEffect, useId, useRef, type ReactElement, type ReactNode } from 'react';

import styled from '@emotion/styled';

import { Button } from '@/components/Button';
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
  }, [cancelDisabled, initialFocus, isConfirmDisabled, open]);

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
