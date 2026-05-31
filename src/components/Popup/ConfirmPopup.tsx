import { useEffect, useId, useRef, type ReactElement, type ReactNode } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components/Text';
import { resolveColorToken, type ColorToken } from '@/styles/tokens';

import { Popup } from './Popup';
import { CONFIRM_POPUP_INITIAL_FOCUS, CONFIRM_POPUP_VARIANT } from './ConfirmPopup.types';
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
  variant = CONFIRM_POPUP_VARIANT.DEFAULT,
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
          <PopupButton
            ref={cancelButtonRef}
            $variant="secondary"
            disabled={cancelDisabled}
            type="button"
            onClick={handleCancel}
          >
            {cancelText}
          </PopupButton>
          <PopupButton
            ref={confirmButtonRef}
            $variant={variant === CONFIRM_POPUP_VARIANT.DANGER ? 'danger' : 'primary'}
            aria-busy={confirmLoading}
            disabled={isConfirmDisabled}
            type="button"
            onClick={handleConfirm}
          >
            {confirmText}
          </PopupButton>
        </Actions>
      </Panel>
    </Popup>
  );
};

type PopupButtonVariant = 'primary' | 'secondary' | 'danger';

type PopupButtonColorTokens = {
  backgroundColor: ColorToken;
  borderColor: ColorToken;
  color: ColorToken;
};

const getButtonColors = (
  variant: PopupButtonVariant,
  disabled: boolean,
): PopupButtonColorTokens => {
  if (disabled) {
    return {
      backgroundColor: 'bg.subtle' as const,
      borderColor: 'border.subtle' as const,
      color: 'text.disabled' as const,
    };
  }

  if (variant === 'primary') {
    return {
      backgroundColor: 'bg.brand' as const,
      borderColor: 'border.brand' as const,
      color: 'text.inverse' as const,
    };
  }

  if (variant === 'danger') {
    return {
      backgroundColor: 'bg.surface' as const,
      borderColor: 'border.danger' as const,
      color: 'text.danger' as const,
    };
  }

  return {
    backgroundColor: 'bg.surface' as const,
    borderColor: 'border.subtle' as const,
    color: 'text.primary' as const,
  };
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

// TODO: Replace this temporary button with the shared Button component when it is available.
const PopupButton = styled.button<{ $variant: PopupButtonVariant }>(
  ({ $variant, disabled, theme }) => {
    const colors = getButtonColors($variant, Boolean(disabled));
    const typography = theme.typography['body-m-sb'];

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
      minHeight: theme.pxToRem(48),
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      border: `1px solid ${resolveColorToken(colors.borderColor)}`,
      borderRadius: theme.radius.full,
      appearance: 'none',
      backgroundColor: resolveColorToken(colors.backgroundColor),
      color: resolveColorToken(colors.color),
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
      touchAction: 'manipulation',
      transition: 'background-color 120ms ease, border-color 120ms ease, opacity 120ms ease, transform 120ms ease',

      '@media (hover: hover)': {
        '&:hover:not(:disabled)': {
          opacity: $variant === 'primary' ? 0.88 : 1,
          backgroundColor: $variant === 'primary' ? undefined : theme.color.bg.subtle,
        },
      },

      '&:active:not(:disabled)': {
        opacity: $variant === 'primary' ? 0.8 : 1,
        transform: 'scale(0.98)',
      },

      '&:focus-visible': {
        outline: `2px solid ${theme.color.border.focused}`,
        outlineOffset: theme.spacing.xs,
      },

      '&:disabled': {
        transform: 'none',
      },

      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',

        '&:active:not(:disabled)': {
          transform: 'none',
        },
      },
    };
  },
);
