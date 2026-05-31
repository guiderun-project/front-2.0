import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

import styled from '@emotion/styled';

import { fieldControlStyles } from './fieldStyles';
import { InputFieldShell } from './InputFieldShell';
import type { InputFieldOwnProps } from './Input.types';

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'aria-describedby' | 'aria-invalid' | 'children' | 'id'
>;

export type InputProps = InputFieldOwnProps &
  NativeInputProps & {
    /** Shows a clear (×) button while the field has a value. */
    clearable?: boolean;
    /** Accessible name for the clear button. Defaults to "입력 내용 지우기". */
    clearLabel?: string;
    onClear?: () => void;
    /** Trailing content rendered inside the field (e.g. a timer + confirm button). */
    trailing?: ReactNode;
    className?: string;
  };

/**
 * Single-line text field with a floating label, helper/error message, optional
 * character counter and clear button. The label is a real `<label>` associated
 * with the input, so screen readers announce it regardless of its floating
 * position.
 */
export const Input = ({
  label,
  helperText,
  errorText,
  maxLength,
  clearable,
  clearLabel,
  onClear,
  trailing,
  className,
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
      defaultValue={defaultValue}
      errorText={errorText}
      helperText={helperText}
      label={label}
      maxLength={maxLength}
      onChange={onChange}
      onClear={onClear}
      placeholder={placeholder}
      trailing={trailing}
      value={value}
      renderControl={(control) => <StyledInput type="text" {...rest} {...control} />}
    />
  );
};

const StyledInput = styled.input(({ theme }) => fieldControlStyles(theme));
