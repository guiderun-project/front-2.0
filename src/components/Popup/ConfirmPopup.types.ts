export const CONFIRM_POPUP_VARIANT = {
  DEFAULT: 'default',
  DANGER: 'danger',
} as const;

export const CONFIRM_POPUP_INITIAL_FOCUS = {
  CANCEL: 'cancel',
  CONFIRM: 'confirm',
} as const;

export type ConfirmPopupVariant =
  (typeof CONFIRM_POPUP_VARIANT)[keyof typeof CONFIRM_POPUP_VARIANT];

export type ConfirmPopupInitialFocus =
  (typeof CONFIRM_POPUP_INITIAL_FOCUS)[keyof typeof CONFIRM_POPUP_INITIAL_FOCUS];
