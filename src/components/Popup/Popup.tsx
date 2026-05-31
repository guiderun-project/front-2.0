import type { ReactElement, ReactNode } from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import {
  Dialog as AriaDialog,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from 'react-aria-components';

type PopupRole = 'dialog' | 'alertdialog';

type PopupProps = {
  open: boolean;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  role?: PopupRole;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
};

export const Popup = ({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
  closeOnBackdropClick = false,
  closeOnEscape = true,
  onClose,
  onOpenChange,
  open,
  role = 'dialog',
}: PopupProps): ReactElement => {
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);

    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <StyledModalOverlay
      isDismissable={closeOnBackdropClick}
      isKeyboardDismissDisabled={!closeOnEscape}
      isOpen={open}
      onOpenChange={handleOpenChange}
    >
      <StyledModal className={className}>
        <StyledDialog
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          role={role}
        >
          {children}
        </StyledDialog>
      </StyledModal>
    </StyledModalOverlay>
  );
};

const overlayEnter = keyframes`
  from {
    opacity: 0;
  }
`;

const dialogEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.25rem) scale(0.98);
  }
`;

const StyledModalOverlay = styled(AriaModalOverlay)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal,
  display: 'grid',
  placeItems: 'center',
  overflowY: 'auto',
  padding: theme.spacing['3xl'],
  backgroundColor: theme.color.bg['dim-strong'],

  '&[data-entering]': {
    animation: `${overlayEnter} 160ms ease-out both`,
  },

  '@media (prefers-reduced-motion: reduce)': {
    '&[data-entering]': {
      animation: 'none',
    },
  },
}));

const StyledModal = styled(AriaModal)(({ theme }) => ({
  width: `min(100%, ${theme.pxToRem(360)})`,
  outline: 'none',

  '&[data-entering]': {
    animation: `${dialogEnter} 160ms ease-out both`,
  },

  '@media (prefers-reduced-motion: reduce)': {
    '&[data-entering]': {
      animation: 'none',
    },
  },
}));

const StyledDialog = styled(AriaDialog)(({ theme }) => ({
  outline: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));
