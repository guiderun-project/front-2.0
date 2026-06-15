import type { ReactElement } from "react";

import styled from "@emotion/styled";

import { fieldControlStyles } from "./fieldStyles";
import { InputFieldShell } from "./InputFieldShell";
import type { InputProps } from "./Input.types";

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
  placeholder,
  value,
  defaultValue,
  onChange,
  ...rest
}: InputProps): ReactElement => {
  return (
    <InputFieldShell<HTMLInputElement>
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
      trailing={trailing}
      value={value}
      renderControl={(control) => (
        <StyledInput type="text" {...rest} {...control} />
      )}
    />
  );
};

const StyledInput = styled.input(({ theme }) => fieldControlStyles(theme));
