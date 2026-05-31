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
    clearable?: boolean;
    clearLabel?: string;
    onClear?: () => void;
    trailing?: ReactNode;
    className?: string;
  };

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
