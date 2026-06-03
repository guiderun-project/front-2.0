import type { ReactNode } from 'react';

import type { IconName } from '@/components/Icon';
import type { SelectOptions } from '@/components/Select';

type FilterAccessibleName = Exclude<ReactNode, boolean | null | undefined>;

export type FilterMode = 'sheet' | 'cycle';
export type FilterVariant = 'line' | 'solid';

type FilterBaseProps<TValue extends string> = {
  options: SelectOptions<TValue>;
  value?: TValue;
  onChange: (value: TValue) => void;
  icon: IconName;
  variant?: FilterVariant;
  disabled?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

type FilterSheetProps<TValue extends string> = FilterBaseProps<TValue> & {
  mode?: 'sheet';
  sheetTitle: FilterAccessibleName;
  confirmable?: boolean;
  confirmText?: string;
  isBackdropCloseDisabled?: boolean;
  isEscapeCloseDisabled?: boolean;
  maxHeight?: string;
};

type FilterCycleProps<TValue extends string> = FilterBaseProps<TValue> & {
  mode: 'cycle';
  sheetTitle?: never;
  confirmable?: never;
  confirmText?: never;
  isBackdropCloseDisabled?: never;
  isEscapeCloseDisabled?: never;
  maxHeight?: never;
};

export type FilterProps<TValue extends string = string> =
  | FilterSheetProps<TValue>
  | FilterCycleProps<TValue>;
