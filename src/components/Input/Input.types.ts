import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import type { ButtonLevel, ButtonStatus } from "../Button";

export type InputFieldOwnProps = {
  label: string;
  helperText?: ReactNode;
  errorText?: ReactNode;
  /** errorText 없이 에러 스타일(테두리/라벨)만 적용할 때 사용 */
  error?: boolean;
  maxLength?: number;
};

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "aria-describedby" | "aria-invalid" | "children" | "id"
>;

export type InputProps = InputFieldOwnProps &
  NativeInputProps & {
    clearable?: boolean;
    clearLabel?: string;
    onClear?: () => void;
    trailing?: ReactNode;
    className?: string;
    describedById?: string;
    controlRef?: Ref<HTMLInputElement>;
  };

type NativeTextareaProps = Omit<
  ComponentPropsWithoutRef<"textarea">,
  "aria-describedby" | "aria-invalid" | "children" | "id"
>;

export type TextareaProps = InputFieldOwnProps &
  NativeTextareaProps & {
    className?: string;
    controlRef?: Ref<HTMLTextAreaElement>;
  };

export type TimerInputProps = Omit<InputProps, "trailing"> & {
  timerText?: string;
  timerLabel?: string;
  confirmLabel?: string;
  confirmLevel?: ButtonLevel;
  confirmStatus?: ButtonStatus;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
};

export type TimeValue = {
  hours: string;
  minutes: string;
  seconds: string;
};

export type TimeInputProps = {
  label: string;
  helperText?: ReactNode;
  errorText?: ReactNode;
  value?: TimeValue;
  defaultValue?: TimeValue;
  onChange?: (value: TimeValue) => void;
  className?: string;
};
