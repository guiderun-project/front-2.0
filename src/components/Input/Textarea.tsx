import type { ReactElement } from "react";
import { useLayoutEffect, useRef } from "react";

import styled from "@emotion/styled";

import { fieldControlStyles } from "./fieldStyles";
import { InputFieldShell } from "./InputFieldShell";
import type { TextareaProps } from "./Input.types";

const autoGrow = (element: HTMLTextAreaElement): void => {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

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

const StyledTextarea = styled.textarea(({ theme }) =>
  fieldControlStyles(theme, true),
);
