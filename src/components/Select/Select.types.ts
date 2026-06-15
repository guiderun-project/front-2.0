import type { ReactNode, Ref } from 'react';

export type SelectOption<TValue extends string = string> = Readonly<{
  value: TValue;
  label: string;
  description?: string;
  disabled?: boolean;
}>;

export type SelectOptions<TValue extends string = string> = readonly SelectOption<TValue>[];

export type SelectRenderTriggerArgs<TValue extends string = string> = {
  open: () => void;
  isOpen: boolean;
  selectedOption?: SelectOption<TValue>;
  value?: TValue;
  disabled: boolean;
};

type SelectAccessibleName = Exclude<ReactNode, boolean | null | undefined>;

type SelectBaseProps<TValue extends string> = {
  sheetTitle: SelectAccessibleName;
  options: SelectOptions<TValue>;
  value?: TValue;
  onChange: (value: TValue) => void;
  errorText?: ReactNode;
  confirmable?: boolean;
  confirmText?: string;
  disabled?: boolean;
  placeholder?: string;
  isBackdropCloseDisabled?: boolean;
  isEscapeCloseDisabled?: boolean;
  maxHeight?: string;
  triggerRef?: Ref<HTMLButtonElement>;
};

type SelectDefaultTriggerProps = {
  renderTrigger?: undefined;
  label: string;
  ariaLabel?: string;
};

type SelectCustomTriggerProps<TValue extends string> = {
  renderTrigger: (args: SelectRenderTriggerArgs<TValue>) => ReactNode;
  label?: string;
  ariaLabel?: string;
};

export type SelectProps<TValue extends string = string> = SelectBaseProps<TValue> &
  (SelectDefaultTriggerProps | SelectCustomTriggerProps<TValue>);
