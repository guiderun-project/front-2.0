import type { ChangeEvent, ChangeEventHandler, ReactElement, ReactNode, RefObject } from 'react';
import { useId, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { IconButton } from '@/components/Icon';

import {
  CLEAR_ICON_SIZE,
  COUNTER_TOTAL_TYPOGRAPHY,
  DEFAULT_CLEAR_LABEL,
  FIELD_MIN_HEIGHT,
  FLOATED_LABEL_SCALE,
  INFO_TYPOGRAPHY,
  LABEL_TYPOGRAPHY,
  typographyStyle,
} from './fieldStyles';
import type { InputFieldOwnProps } from './Input.types';

type FieldValue = string | number | readonly string[];

export type InputControlRenderProps<E extends HTMLInputElement | HTMLTextAreaElement> = {
  id: string;
  ref: RefObject<E | null>;
  placeholder?: string;
  maxLength?: number;
  value?: FieldValue;
  defaultValue?: FieldValue;
  onChange: ChangeEventHandler<E>;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
};

export type InputFieldShellProps<E extends HTMLInputElement | HTMLTextAreaElement> =
  InputFieldOwnProps & {
    placeholder?: string;
    value?: FieldValue;
    defaultValue?: FieldValue;
    onChange?: ChangeEventHandler<E>;
    /** Shows a clear button (and wires its behaviour) while the field has a value. */
    clearable?: boolean;
    /** Accessible name for the clear button. */
    clearLabel?: string;
    onClear?: () => void;
    /** Extra trailing content rendered after the clear button (timer, confirm button, …). */
    trailing?: ReactNode;
    className?: string;
    renderControl: (control: InputControlRenderProps<E>) => ReactNode;
  };

/**
 * Reset a field to an empty value the way the browser would, so React's
 * synthetic `onChange` fires for both controlled and uncontrolled fields.
 */
const setNativeValue = (
  element: HTMLInputElement | HTMLTextAreaElement,
  nextValue: string,
): void => {
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

  valueSetter?.call(element, nextValue);
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

/**
 * Private layout + accessibility shell for the Input family. Owns the floating
 * label, helper/error message, character counter, clear button, and the ARIA
 * wiring that connects them to the editable control. The visual states
 * (default / focused / typing / filled / error) are derived from CSS and the
 * value the consumer supplies — there is no `status` prop.
 */
export const InputFieldShell = <E extends HTMLInputElement | HTMLTextAreaElement>({
  label,
  helperText,
  errorText,
  maxLength,
  placeholder,
  value,
  defaultValue,
  onChange,
  clearable = false,
  clearLabel = DEFAULT_CLEAR_LABEL,
  onClear,
  trailing,
  className,
  renderControl,
}: InputFieldShellProps<E>): ReactElement => {
  const reactId = useId();
  const controlId = `${reactId}-control`;
  const messageId = `${reactId}-message`;
  const counterId = `${reactId}-counter`;
  const controlRef = useRef<E>(null);

  const isControlled = value !== undefined;
  const [uncontrolledLength, setUncontrolledLength] = useState(() =>
    defaultValue != null ? String(defaultValue).length : 0,
  );
  const length = isControlled ? (value != null ? String(value).length : 0) : uncontrolledLength;
  const hasValue = length > 0;

  const hasError = Boolean(errorText);
  const message = hasError ? errorText : helperText;
  const hasMessage = Boolean(message);
  const showCounter = maxLength != null;

  const describedBy =
    [hasMessage ? messageId : null, showCounter ? counterId : null].filter(Boolean).join(' ') ||
    undefined;

  const handleChange = (event: ChangeEvent<E>): void => {
    if (!isControlled) {
      setUncontrolledLength(event.target.value.length);
    }
    onChange?.(event);
  };

  const handleClear = (): void => {
    const element = controlRef.current;
    if (element) {
      setNativeValue(element, '');
      element.focus();
    }
    if (!isControlled) {
      setUncontrolledLength(0);
    }
    onClear?.();
  };

  return (
    <Root className={className} data-error={hasError || undefined}>
      <FieldBox data-filled={hasValue || undefined}>
        <Field>
          <FloatingLabel htmlFor={controlId}>{label}</FloatingLabel>
          {renderControl({
            id: controlId,
            ref: controlRef,
            placeholder,
            maxLength,
            value,
            defaultValue,
            onChange: handleChange,
            'aria-invalid': hasError || undefined,
            'aria-describedby': describedBy,
          })}
        </Field>
        {clearable && hasValue && (
          <IconButton
            aria-label={clearLabel}
            color="icon.tertiary"
            icon="delete-filled"
            iconSize={CLEAR_ICON_SIZE}
            onClick={handleClear}
            size={CLEAR_ICON_SIZE}
          />
        )}
        {trailing}
      </FieldBox>
      {(hasMessage || showCounter) && (
        <InfoRow>
          {hasMessage && (
            <Message $error={hasError} id={messageId} role={hasError ? 'alert' : undefined}>
              {message}
            </Message>
          )}
          {showCounter && (
            <Counter id={counterId}>
              <CounterCurrent $error={hasError}>{length}</CounterCurrent>
              <CounterTotal>/{maxLength}자</CounterTotal>
            </Counter>
          )}
        </InfoRow>
      )}
    </Root>
  );
};

const Root = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  width: '100%',
}));

const FieldBox = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
  minHeight: theme.pxToRem(FIELD_MIN_HEIGHT),
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.color.border.default}`,
  backgroundColor: theme.color.bg.default,
  // Thicken the border on focus/error via an inset shadow so the 1px → 2px
  // change never shifts the layout.
  transition: 'border-color 120ms ease, box-shadow 120ms ease',

  '&:focus-within': {
    borderColor: theme.color.border.brand,
    boxShadow: `inset 0 0 0 1px ${theme.color.border.brand}`,
  },

  '&:focus-within label, &[data-filled="true"] label': {
    top: 0,
    transform: `translateY(0) scale(${FLOATED_LABEL_SCALE})`,
    transformOrigin: 'left top',
    color: theme.color.text.tertiary,
  },

  '&:focus-within label': {
    color: theme.color.text.brand,
  },

  "[data-error='true'] &": {
    borderColor: theme.color.border.danger,
    boxShadow: `inset 0 0 0 1px ${theme.color.border.danger}`,
  },

  "[data-error='true'] & label": {
    color: theme.color.text.danger,
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));

const Field = styled.div({
  position: 'relative',
  flex: 1,
  minWidth: 0,
});

const FloatingLabel = styled.label(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: '50%',
  maxWidth: '100%',
  transform: 'translateY(-50%) scale(1)',
  transformOrigin: 'left center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  pointerEvents: 'none',
  color: theme.color.text.tertiary,
  ...typographyStyle(theme, LABEL_TYPOGRAPHY),
  transition: 'transform 120ms ease, color 120ms ease, top 120ms ease',

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'color 120ms ease',
  },
}));

const InfoRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
}));

const Message = styled.p<{ $error: boolean }>(({ theme, $error }) => ({
  flex: 1,
  minWidth: 0,
  margin: 0,
  color: $error ? theme.color.text.danger : theme.color.text.tertiary,
  ...typographyStyle(theme, INFO_TYPOGRAPHY),
}));

const Counter = styled.div(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  gap: theme.spacing.xs,
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
}));

const CounterCurrent = styled.span<{ $error: boolean }>(({ theme, $error }) => ({
  color: $error ? theme.color.text.danger : theme.color.text.brand,
  ...typographyStyle(theme, INFO_TYPOGRAPHY),
}));

const CounterTotal = styled.span(({ theme }) => ({
  color: theme.color.text.tertiary,
  ...typographyStyle(theme, COUNTER_TOTAL_TYPOGRAPHY),
}));
