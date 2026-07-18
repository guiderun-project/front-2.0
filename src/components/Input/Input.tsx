import type { ReactElement } from "react";

import styled from "@emotion/styled";

import { fieldControlStyles } from "./fieldStyles";
import { InputFieldShell } from "./InputFieldShell";
import type { InputProps } from "./Input.types";

// 브라우저가 자체 플레이스홀더/피커 UI를 항상 그리는 타입들.
// 값이 비어 있어도 라벨을 띄워야 텍스트가 겹치지 않는다.
const NATIVE_PICKER_TYPES = new Set(["date", "time", "datetime-local", "month", "week"]);

export const Input = ({
  label,
  helperText,
  errorText,
  error,
  maxLength,
  clearable,
  clearLabel,
  onClear,
  trailing,
  className,
  describedById,
  controlRef,
  requirement,
  placeholder,
  value,
  defaultValue,
  onChange,
  ...rest
}: InputProps): ReactElement => {
  return (
    <InputFieldShell<HTMLInputElement>
      alwaysFloatLabel={NATIVE_PICKER_TYPES.has(rest.type ?? "")}
      className={className}
      clearLabel={clearLabel}
      clearable={clearable}
      controlRef={controlRef}
      defaultValue={defaultValue}
      describedById={describedById}
      error={error}
      errorText={errorText}
      helperText={helperText}
      label={label}
      maxLength={maxLength}
      onChange={onChange}
      onClear={onClear}
      placeholder={placeholder}
      requirement={requirement}
      trailing={trailing}
      value={value}
      renderControl={(control) => (
        <StyledInput type="text" {...rest} {...control} />
      )}
    />
  );
};

const StyledInput = styled.input(({ theme }) => fieldControlStyles(theme));
