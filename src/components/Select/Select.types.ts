import type { ReactNode, Ref } from 'react';

export type SelectOption<TValue extends string = string> = Readonly<{
  value: TValue;
  label: string;
  /**
   * 스크린리더 전용 라벨. 지정하면 옵션 버튼의 낭독 내용(label·description
   * 대신)과 트리거의 "현재 선택" 낭독에 우선 사용된다. 화면 표시는 항상
   * label을 따른다.
   */
  srLabel?: string;
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
  /** errorText 존재 여부. 커스텀 트리거의 aria-invalid 연결에 사용한다. */
  hasError: boolean;
  /** 오류 메시지 요소의 id. 커스텀 트리거의 aria-describedby 연결에 사용한다. */
  errorId: string;
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
  required?: boolean;
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
