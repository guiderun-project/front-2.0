import type { ReactNode } from 'react';

type BottomSheetAccessibleName = Exclude<ReactNode, boolean | null | undefined>;

export type BottomSheetHeading = {
  title: BottomSheetAccessibleName;
  subtitle?: ReactNode;
  description?: ReactNode;
};

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

export type BottomSheetProps = BottomSheetBaseProps & BottomSheetA11yProps;
