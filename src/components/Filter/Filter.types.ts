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
  /** value가 이 값과 같으면 선택값 대신 placeholder를 트리거에 표시한다(시트 선택 표시는 유지). */
  placeholderValue?: TValue;
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
