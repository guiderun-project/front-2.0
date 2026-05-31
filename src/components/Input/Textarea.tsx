import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { useLayoutEffect, useRef } from 'react';

import styled from '@emotion/styled';

import { fieldControlStyles } from './fieldStyles';
import { InputFieldShell } from './InputFieldShell';
import type { InputFieldOwnProps } from './Input.types';

type NativeTextareaProps = Omit<
  ComponentPropsWithoutRef<'textarea'>,
  'aria-describedby' | 'aria-invalid' | 'children' | 'id'
>;

export type TextareaProps = InputFieldOwnProps &
  NativeTextareaProps & {
    className?: string;
  };

const autoGrow = (element: HTMLTextAreaElement): void => {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

/**
 * Multi-line text field. Shares the floating label, helper/error message and
 * character counter with `Input`, but the label rests at the top and the field
 * grows with its content instead of scrolling.
 */
export const Textarea = ({
  label,
  helperText,
  errorText,
  maxLength,
  className,
  placeholder,
  value,
  defaultValue,
  onChange,
  ...rest
}: TextareaProps): ReactElement => {
  const innerRef = useRef<HTMLTextAreaElement>(null);

  // Keep the height in sync with the content, including the initial
  // `defaultValue` / controlled `value` render.
  useLayoutEffect(() => {
    if (innerRef.current) {
      autoGrow(innerRef.current);
    }
  }, [value]);

  return (
    <InputFieldShell<HTMLTextAreaElement>
      className={className}
      defaultValue={defaultValue}
      errorText={errorText}
      helperText={helperText}
      label={label}
      maxLength={maxLength}
      multiline
      onChange={(event) => {
        autoGrow(event.currentTarget);
        onChange?.(event);
      }}
      placeholder={placeholder}
      value={value}
      renderControl={({ ref, ...control }) => (
        <StyledTextarea
          rows={1}
          {...rest}
          {...control}
          ref={(node) => {
            ref.current = node;
            innerRef.current = node;
          }}
        />
      )}
    />
  );
};

const StyledTextarea = styled.textarea(({ theme }) => fieldControlStyles(theme, true));
