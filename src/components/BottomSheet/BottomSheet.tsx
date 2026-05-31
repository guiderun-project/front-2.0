import { useId, type ReactElement, type ReactNode } from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import {
  Dialog as AriaDialog,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from 'react-aria-components';

import { IconButton } from '@/components/Icon';
import { Text } from '@/components/Text';

import type { BottomSheetHeading } from './BottomSheet.types';

const DEFAULT_MAX_HEIGHT = 'calc(100dvh - 48px)';

type BottomSheetAccessibleName = Exclude<ReactNode, boolean | null | undefined>;

type BottomSheetBaseProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  isCloseButtonHidden?: boolean;
  isBackdropCloseDisabled?: boolean;
  isEscapeCloseDisabled?: boolean;
  maxHeight?: string;
  className?: string;
};

type BottomSheetNamedByHeading = {
  heading: BottomSheetHeading;
  topBarTitle?: ReactNode;
  ariaLabel?: string;
};

type BottomSheetNamedByTopBarTitle = {
  heading?: undefined;
  topBarTitle: BottomSheetAccessibleName;
  ariaLabel?: string;
};

type BottomSheetNamedByAriaLabel = {
  heading?: undefined;
  topBarTitle?: undefined;
  ariaLabel: string;
};

type BottomSheetA11yProps =
  | BottomSheetNamedByHeading
  | BottomSheetNamedByTopBarTitle
  | BottomSheetNamedByAriaLabel;

type BottomSheetProps = BottomSheetBaseProps & BottomSheetA11yProps;

export const BottomSheet = ({
  ariaLabel,
  children,
  className,
  footer,
  heading,
  isBackdropCloseDisabled = false,
  isCloseButtonHidden = false,
  isEscapeCloseDisabled = false,
  maxHeight = DEFAULT_MAX_HEIGHT,
  onClose,
  onOpenChange,
  open,
  topBarTitle,
}: BottomSheetProps): ReactElement => {
  const topBarTitleId = useId();
  const headingTitleId = useId();
  const headingDescriptionId = useId();
  const hasTopBarTitle = isRenderable(topBarTitle);
  const hasHeadingTitle = isRenderable(heading?.title);
  const hasHeadingDescription = isRenderable(heading?.description);
  const hasTopBar = hasTopBarTitle || !isCloseButtonHidden;
  const labelledById = getLabelledById({
    hasHeadingTitle,
    headingTitleId,
    hasTopBarTitle,
    topBarTitleId,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);

    if (!nextOpen) {
      onClose?.();
    }
  };

  const handleClose = () => {
    handleOpenChange(false);
  };

  return (
    <Overlay
      isDismissable={!isBackdropCloseDisabled}
      isKeyboardDismissDisabled={isEscapeCloseDisabled}
      isOpen={open}
      onOpenChange={handleOpenChange}
    >
      <Positioner>
        <Dialog
          aria-describedby={hasHeadingDescription ? headingDescriptionId : undefined}
          aria-label={labelledById ? undefined : ariaLabel}
          aria-labelledby={labelledById}
        >
          <Sheet $maxHeight={maxHeight} className={className}>
            {hasTopBar ? (
              <TopBar>
                {hasTopBarTitle ? (
                  <TopBarTitle color="text.primary" font="body-l-sb" id={topBarTitleId}>
                    {topBarTitle}
                  </TopBarTitle>
                ) : null}
                {!isCloseButtonHidden ? (
                  <IconButton
                    aria-label="닫기"
                    icon="delete-lined"
                    iconSize={24}
                    size={24}
                    onClick={handleClose}
                  />
                ) : null}
              </TopBar>
            ) : null}

            {heading ? (
              <Heading $hasTopBar={hasTopBar}>
                <HeadingTitleGroup>
                  {isRenderable(heading.subtitle) ? (
                    <Text align="center" as="p" color="text.secondary" font="body-m-m">
                      {heading.subtitle}
                    </Text>
                  ) : null}
                  {hasHeadingTitle ? (
                    <Text
                      align="center"
                      as="h2"
                      color="text.primary"
                      font="heading-s-sb"
                      id={headingTitleId}
                    >
                      {heading.title}
                    </Text>
                  ) : null}
                </HeadingTitleGroup>
                {hasHeadingDescription ? (
                  <Text
                    align="center"
                    as="p"
                    color="text.tertiary"
                    font="body-m-m"
                    id={headingDescriptionId}
                  >
                    {heading.description}
                  </Text>
                ) : null}
              </Heading>
            ) : null}

            <Content>{children}</Content>

            {isRenderable(footer) ? <Footer>{footer}</Footer> : null}
          </Sheet>
        </Dialog>
      </Positioner>
    </Overlay>
  );
};

const isRenderable = (value: ReactNode): boolean =>
  value !== undefined && value !== null && value !== false && value !== '';

type LabelledByIdOptions = {
  hasHeadingTitle: boolean;
  headingTitleId: string;
  hasTopBarTitle: boolean;
  topBarTitleId: string;
};

const getLabelledById = ({
  hasHeadingTitle,
  headingTitleId,
  hasTopBarTitle,
  topBarTitleId,
}: LabelledByIdOptions): string | undefined => {
  if (hasHeadingTitle) {
    return headingTitleId;
  }

  if (hasTopBarTitle) {
    return topBarTitleId;
  }

  return undefined;
};

const overlayEnter = keyframes`
  from {
    opacity: 0;
  }
`;

const overlayExit = keyframes`
  to {
    opacity: 0;
  }
`;

const sheetEnter = keyframes`
  from {
    transform: translateY(100%);
  }
`;

const sheetExit = keyframes`
  to {
    transform: translateY(100%);
  }
`;

const Overlay = styled(AriaModalOverlay)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  backgroundColor: theme.color.bg['dim-strong'],

  '&[data-entering]': {
    animation: `${overlayEnter} 180ms ease-out both`,
  },

  '&[data-exiting]': {
    animation: `${overlayExit} 160ms ease-in both`,
  },

  '@media (prefers-reduced-motion: reduce)': {
    '&[data-entering], &[data-exiting]': {
      animation: 'none',
    },
  },
}));

const Positioner = styled(AriaModal)(({ theme }) => ({
  width: `min(100%, ${theme.pxToRem(430)})`,
  outline: 'none',
  willChange: 'transform',

  '&[data-entering]': {
    animation: `${sheetEnter} 240ms cubic-bezier(0.22, 1, 0.36, 1) both`,
  },

  '&[data-exiting]': {
    animation: `${sheetExit} 180ms cubic-bezier(0.4, 0, 1, 1) both`,
  },

  '@media (prefers-reduced-motion: reduce)': {
    willChange: 'auto',

    '&[data-entering], &[data-exiting]': {
      animation: 'none',
    },
  },
}));

const Dialog = styled(AriaDialog)(({ theme }) => ({
  outline: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: `-${theme.spacing.sm}`,
  },
}));

const Sheet = styled.div<{ $maxHeight: string }>(({ $maxHeight, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxHeight: $maxHeight,
  overflow: 'hidden',
  borderTopLeftRadius: theme.pxToRem(20),
  borderTopRightRadius: theme.pxToRem(20),
  backgroundColor: theme.color.bg.default,
  boxShadow: theme.effect['bottom-shadow'],
}));

const TopBar = styled.header(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
  gap: theme.spacing['2xl'],
  width: '100%',
  minHeight: theme.pxToRem(56),
  padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
}));

const TopBarTitle = styled(Text)({
  flex: '1 1 auto',
  minWidth: 0,
  margin: 0,
});

const Heading = styled.div<{ $hasTopBar: boolean }>(({ $hasTopBar, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  gap: theme.spacing.md,
  width: '100%',
  padding: `${$hasTopBar ? theme.spacing.none : theme.spacing['3xl']} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,

  'h2, p': {
    margin: 0,
  },
}));

const HeadingTitleGroup = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.xs,
  width: '100%',
}));

const Content = styled.div({
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  scrollbarWidth: 'none',
  width: '100%',

  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const Footer = styled.footer(({ theme }) => ({
  flexShrink: 0,
  width: '100%',
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} calc(${theme.spacing['2xl']} + env(safe-area-inset-bottom))`,
}));
