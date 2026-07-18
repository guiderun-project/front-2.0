import type { ChangeEvent, ReactElement } from "react";

import { Input } from "./Input";
import type { InputProps } from "./Input.types";

export type DateInputProps = Omit<
  InputProps,
  | "autoComplete"
  | "inputMode"
  | "onChange"
  | "pattern"
  | "placeholder"
  | "type"
  | "value"
> & {
  /** ISO 형식(YYYY-MM-DD). input[type=date] 의 value 형식과 같아 변환 없이 그대로 쓴다. */
  value: string;
  onChange?: (value: string) => void;
};

/**
 * 브라우저 기본 date picker 를 쓰는 날짜 입력.
 *
 * role="textbox" 는 iOS Safari + VoiceOver 에서 date picker 가 열리지 않는 WebKit 이슈의
 * 임시 우회다. (참고: https://github.com/facebook/react/issues/33541)
 * WebKit 에서 고쳐지면 제거한다.
 */
export const DateInput = ({
  value,
  onChange,
  ...props
}: DateInputProps): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(event.target.value);
  };

  return (
    <Input
      {...props}
      autoComplete="off"
      role="textbox"
      type="date"
      value={value}
      onChange={handleChange}
    />
  );
};
