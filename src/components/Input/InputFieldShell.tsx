import type {
  ChangeEvent,
  ChangeEventHandler,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import { useId, useLayoutEffect, useRef, useState } from "react";

import styled from "@emotion/styled";

import { HiddenText } from "@/components/HiddenText";
import { IconButton } from "@/components/Icon";

import {
  CARET_BAR_HEIGHT,
  CARET_BAR_WIDTH,
  CLEAR_ICON_SIZE,
  CONTROL_TOP_SPACE,
  COUNTER_TOTAL_TYPOGRAPHY,
  DEFAULT_CLEAR_LABEL,
  FIELD_MIN_HEIGHT,
  INFO_TYPOGRAPHY,
  LABEL_TYPOGRAPHY,
  MULTILINE_CARET_BAR_HEIGHT,
  MULTILINE_FIELD_MIN_HEIGHT,
  typographyStyle,
} from "./fieldStyles";
import type { InputFieldOwnProps } from "./Input.types";

type FieldValue = string | number | readonly string[];

type InputControlRenderProps<E extends HTMLInputElement | HTMLTextAreaElement> =
  {
    id: string;
    ref: RefObject<E | null>;
    placeholder?: string;
    maxLength?: number;
    value?: FieldValue;
    defaultValue?: FieldValue;
    onChange: ChangeEventHandler<E>;
    "aria-invalid": true | undefined;
    "aria-describedby": string | undefined;
  };

type InputFieldShellProps<E extends HTMLInputElement | HTMLTextAreaElement> =
  InputFieldOwnProps & {
    placeholder?: string;
    value?: FieldValue;
    defaultValue?: FieldValue;
    onChange?: ChangeEventHandler<E>;
    clearable?: boolean;
    clearLabel?: string;
    onClear?: () => void;
    trailing?: ReactNode;
    multiline?: boolean;
    className?: string;
    describedById?: string;
    controlRef?: Ref<E>;
    renderControl: (control: InputControlRenderProps<E>) => ReactNode;
  };

const setNativeValue = (
  element: HTMLInputElement | HTMLTextAreaElement,
  nextValue: string,
): void => {
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

  valueSetter?.call(element, nextValue);
  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const assignRef = <E extends HTMLInputElement | HTMLTextAreaElement>(
  ref: Ref<E> | undefined,
  node: E | null,
): void => {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(node);
    return;
  }

  ref.current = node;
};

export const InputFieldShell = <
  E extends HTMLInputElement | HTMLTextAreaElement,
>({
  label,
  helperText,
  errorText,
  error = false,
  maxLength,
  placeholder,
  value,
  defaultValue,
  onChange,
  clearable = false,
  clearLabel = DEFAULT_CLEAR_LABEL,
  onClear,
  trailing,
  multiline = false,
  className,
  describedById,
  controlRef: externalControlRef,
  renderControl,
}: InputFieldShellProps<E>): ReactElement => {
  const reactId = useId();
  const controlId = `${reactId}-control`;
  const messageId = `${reactId}-message`;
  const counterId = `${reactId}-counter`;
  const controlRef = useRef<E>(null);

  useLayoutEffect(() => {
    assignRef(externalControlRef, controlRef.current);

    return () => {
      assignRef(externalControlRef, null);
    };
  }, [externalControlRef]);

  const isControlled = value !== undefined;
  const [uncontrolledLength, setUncontrolledLength] = useState(() =>
    defaultValue != null ? String(defaultValue).length : 0,
  );
  const length = isControlled
    ? value != null
      ? String(value).length
      : 0
    : uncontrolledLength;
  const hasValue = length > 0;

  const hasError = Boolean(errorText) || error;
  const message = hasError ? errorText : helperText;
  const hasMessage = Boolean(message);
  const showCounter = maxLength != null;

  const describedBy =
    [
      hasMessage ? messageId : null,
      showCounter ? counterId : null,
      describedById ?? null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const handleChange = (event: ChangeEvent<E>): void => {
    if (!isControlled) {
      setUncontrolledLength(event.target.value.length);
    }
    onChange?.(event);
  };

  const handleClear = (): void => {
    const element = controlRef.current;
    if (element) {
      setNativeValue(element, "");
      element.focus();
    }
    if (!isControlled) {
      setUncontrolledLength(0);
    }
    onClear?.();
  };

  return (
    <Root className={className} data-error={hasError || undefined}>
      <FieldBox
        data-filled={hasValue || undefined}
        data-multiline={multiline || undefined}
      >
        <Field>
          <FloatingLabel htmlFor={controlId}>{label}</FloatingLabel>
          <Caret aria-hidden="true" data-caret="" />
          {renderControl({
            id: controlId,
            ref: controlRef,
            placeholder,
            maxLength,
            value,
            defaultValue,
            onChange: handleChange,
            "aria-invalid": hasError || undefined,
            "aria-describedby": describedBy,
          })}
        </Field>
        {clearable && hasValue && (
          <ClearButton
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
            <Message
              $error={hasError}
              data-helper={!hasError || undefined}
              id={messageId}
              role={hasError ? "alert" : undefined}
            >
              {message}
            </Message>
          )}
          {showCounter && (
            <Counter id={counterId} role="text">
              <CounterCurrent $error={hasError}>
                <HiddenText>현재</HiddenText>
                {length}
              </CounterCurrent>
              <CounterTotal>
                /<HiddenText>최대 글자 수</HiddenText>
                {maxLength}자
              </CounterTotal>
            </Counter>
          )}
        </InfoRow>
      )}
    </Root>
  );
};

const Root = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.md,
  width: "100%",
  "&:focus-within [data-helper]": {
    color: theme.color.text.brand,
  },
}));

const FieldBox = styled.div(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.sm,
  minHeight: theme.pxToRem(FIELD_MIN_HEIGHT),
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.color.border.default}`,
  backgroundColor: theme.color.bg.default,
  transition: "border-color 120ms ease, box-shadow 120ms ease",

  '&[data-multiline="true"]': {
    alignItems: "flex-start",
    minHeight: theme.pxToRem(MULTILINE_FIELD_MIN_HEIGHT),
  },

  '&[data-multiline="true"] [data-caret]': {
    top: theme.pxToRem(
      CONTROL_TOP_SPACE + (24 - MULTILINE_CARET_BAR_HEIGHT) / 2,
    ),
    bottom: "auto",
    height: theme.pxToRem(MULTILINE_CARET_BAR_HEIGHT),
  },

  '&[data-multiline="true"] label': {
    top: 0,
    transform: "translateY(0) scale(1)",
    transformOrigin: "left top",
  },

  "&:focus-within": {
    borderColor: theme.color.border.brand,
    boxShadow: `inset 0 0 0 1px ${theme.color.border.brand}`,
  },

  "&:focus-within:not([data-filled]) [data-caret]": {
    opacity: 1,
  },

  '&:focus-within label, &[data-filled="true"] label': {
    top: 0,
    transform: "translateY(0)",
    transformOrigin: "left top",
    color: theme.color.text.tertiary,
    ...typographyStyle(theme, INFO_TYPOGRAPHY),
  },

  "&:focus-within label": {
    color: theme.color.text.brand,
  },

  "[data-error='true'] &": {
    borderColor: theme.color.border.danger,
    boxShadow: `inset 0 0 0 1px ${theme.color.border.danger}`,
  },

  "[data-error='true'] & label": {
    color: theme.color.text.danger,
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));

const Field = styled.div({
  position: "relative",
  flex: 1,
  minWidth: 0,
});

const ClearButton = styled(IconButton)(({ theme }) => ({
  alignSelf: "flex-end",
  marginBottom: theme.spacing.xs,
}));

const Caret = styled.span(({ theme }) => ({
  position: "absolute",
  left: 0,
  bottom: theme.pxToRem((28 - CARET_BAR_HEIGHT) / 2),
  width: theme.pxToRem(CARET_BAR_WIDTH),
  height: theme.pxToRem(CARET_BAR_HEIGHT),
  borderRadius: theme.pxToRem(1),
  backgroundColor: theme.color.bg["brand-primary"],
  opacity: 0,
  pointerEvents: "none",
}));

const FloatingLabel = styled.label(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: "50%",
  maxWidth: "100%",
  transform: "translateY(-50%) scale(1)",
  transformOrigin: "left center",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  pointerEvents: "none",
  color: theme.color.text.tertiary,
  ...typographyStyle(theme, LABEL_TYPOGRAPHY),
  transition:
    "transform 120ms ease, color 120ms ease, top 120ms ease, font-size 120ms ease, line-height 120ms ease, letter-spacing 120ms ease",

  "@media (prefers-reduced-motion: reduce)": {
    transition: "color 120ms ease",
  },
}));

const InfoRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.lg,
  width: "100%",
}));

const Message = styled.p<{ $error: boolean }>(({ theme, $error }) => ({
  flex: 1,
  minWidth: 0,
  margin: 0,
  color: $error ? theme.color.text.danger : theme.color.text.tertiary,
  ...typographyStyle(theme, INFO_TYPOGRAPHY),
}));

const Counter = styled.div(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
  gap: theme.spacing.xs,
  marginLeft: "auto",
  whiteSpace: "nowrap",
}));

const CounterCurrent = styled.span<{ $error: boolean }>(
  ({ theme, $error }) => ({
    color: $error ? theme.color.text.danger : theme.color.text.brand,
    ...typographyStyle(theme, INFO_TYPOGRAPHY),
  }),
);

const CounterTotal = styled.span(({ theme }) => ({
  color: theme.color.text.tertiary,
  ...typographyStyle(theme, COUNTER_TOTAL_TYPOGRAPHY),
}));
