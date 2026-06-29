import type { ChangeEvent, ReactElement } from "react";
import { useId, useRef, useState } from "react";

import styled from "@emotion/styled";

import {
  CONTROL_TOP_SPACE,
  FIELD_MIN_HEIGHT,
  FLOATED_LABEL_SCALE,
  INFO_TYPOGRAPHY,
  LABEL_TYPOGRAPHY,
  typographyStyle,
} from "./fieldStyles";
import type { TimeInputProps, TimeValue } from "./Input.types";

const SEGMENT_PLACEHOLDER = "--";

type SegmentKey = "hours" | "minutes" | "seconds";

const EMPTY_TIME: TimeValue = { hours: "", minutes: "", seconds: "" };

const SEGMENTS: ReadonlyArray<{ key: SegmentKey; label: string }> = [
  { key: "hours", label: "시" },
  { key: "minutes", label: "분" },
  { key: "seconds", label: "초" },
];

// 각 칸(시/분/초)은 자기 값(최대 2자리)을 앞에서부터 채운다. 한 칸이 다 차면
// 다음 칸으로 포커스를 옮겨 연속 입력을 지원하고, 빈 칸에서 Backspace 시 이전 칸으로 이동한다.
const MAX_SEGMENT_LENGTH = 2;

export const TimeInput = ({
  label,
  helperText,
  errorText,
  value,
  defaultValue,
  onChange,
  className,
}: TimeInputProps): ReactElement => {
  const reactId = useId();
  const labelId = `${reactId}-label`;
  const messageId = `${reactId}-message`;
  const segmentRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<TimeValue>(
    defaultValue ?? EMPTY_TIME,
  );
  const current = isControlled ? value : internalValue;

  const hasError = Boolean(errorText);
  const message = hasError ? errorText : helperText;
  const hasMessage = Boolean(message);
  const hasValue = Boolean(current.hours || current.minutes || current.seconds);

  const commit = (next: TimeValue): void => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const handleSegmentChange =
    (index: number, key: SegmentKey) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const next = event.target.value
        .replace(/\D/g, "")
        .slice(0, MAX_SEGMENT_LENGTH);
      commit({ ...current, [key]: next });

      if (next.length === MAX_SEGMENT_LENGTH && index < SEGMENTS.length - 1) {
        segmentRefs.current[index + 1]?.focus();
      }
    };

  const handleSegmentKeyDown =
    (index: number, key: SegmentKey) =>
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key !== "Backspace" || current[key] !== "" || index === 0) {
        return;
      }

      event.preventDefault();
      const previousKey = SEGMENTS[index - 1].key;
      commit({ ...current, [previousKey]: current[previousKey].slice(0, -1) });
      segmentRefs.current[index - 1]?.focus();
    };

  const handleSegmentFocus = (
    event: React.FocusEvent<HTMLInputElement>,
  ): void => {
    const input = event.currentTarget;
    const end = input.value.length;
    input.setSelectionRange(end, end);
  };

  const handleBoxPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ): void => {
    if (event.target !== event.currentTarget) {
      return;
    }

    event.preventDefault();
    const firstIncompleteIndex = SEGMENTS.findIndex(
      (segment) => current[segment.key].length < MAX_SEGMENT_LENGTH,
    );
    const targetIndex =
      firstIncompleteIndex === -1 ? SEGMENTS.length - 1 : firstIncompleteIndex;
    segmentRefs.current[targetIndex]?.focus();
  };

  return (
    <Root className={className} data-error={hasError || undefined}>
      <FieldBox
        data-filled={hasValue || undefined}
        onPointerDown={handleBoxPointerDown}
      >
        <FloatingLabel data-floating-label="" id={labelId}>
          {label}
        </FloatingLabel>
        <SegmentRow
          aria-describedby={hasMessage ? messageId : undefined}
          aria-labelledby={labelId}
          data-segments=""
          role="group"
        >
          {SEGMENTS.map((segment, index) => (
            <SegmentSlot key={segment.key}>
              {index > 0 && <Separator aria-hidden="true">:</Separator>}
              <Segment
                aria-invalid={hasError || undefined}
                aria-label={segment.label}
                inputMode="numeric"
                maxLength={MAX_SEGMENT_LENGTH}
                onChange={handleSegmentChange(index, segment.key)}
                onFocus={handleSegmentFocus}
                onKeyDown={handleSegmentKeyDown(index, segment.key)}
                placeholder={SEGMENT_PLACEHOLDER}
                ref={(node) => {
                  segmentRefs.current[index] = node;
                }}
                value={current[segment.key]}
              />
            </SegmentSlot>
          ))}
        </SegmentRow>
      </FieldBox>
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
  minHeight: theme.pxToRem(FIELD_MIN_HEIGHT),
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.color.border.default}`,
  backgroundColor: theme.color.bg.default,
  transition: "border-color 120ms ease, box-shadow 120ms ease",

  "&:focus-within": {
    borderColor: theme.color.border.brand,
    boxShadow: `inset 0 0 0 1px ${theme.color.border.brand}`,
  },

  '&:focus-within [data-floating-label], &[data-filled="true"] [data-floating-label]':
    {
      top: theme.spacing.lg,
      transform: `translateY(0) scale(${FLOATED_LABEL_SCALE})`,
      transformOrigin: "left top",
      color: theme.color.text.tertiary,
    },

  "&:focus-within [data-floating-label]": {
    color: theme.color.text.brand,
  },

  "& [data-segments]": {
    opacity: 0,
    transition: "opacity 120ms ease",
  },

  '&:focus-within [data-segments], &[data-filled="true"] [data-segments]': {
    opacity: 1,
  },

  "[data-error='true'] &": {
    borderColor: theme.color.border.danger,
    boxShadow: `inset 0 0 0 1px ${theme.color.border.danger}`,
  },

  "[data-error='true'] & [data-floating-label]": {
    color: theme.color.text.danger,
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",

    "& [data-segments]": {
      transition: "none",
    },
  },
}));

const FloatingLabel = styled.span(({ theme }) => ({
  position: "absolute",
  left: theme.spacing.xl,
  top: "50%",
  maxWidth: `calc(100% - ${theme.spacing.xl} * 2)`,
  transform: "translateY(-50%) scale(1)",
  transformOrigin: "left center",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  pointerEvents: "none",
  color: theme.color.text.tertiary,
  ...typographyStyle(theme, LABEL_TYPOGRAPHY),
  transition: "transform 120ms ease, color 120ms ease, top 120ms ease",

  "@media (prefers-reduced-motion: reduce)": {
    transition: "color 120ms ease",
  },
}));

const SegmentRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  paddingTop: theme.pxToRem(CONTROL_TOP_SPACE),
}));

const SegmentSlot = styled.div({
  display: "flex",
  flex: 1,
  minWidth: 0,
  alignItems: "center",
});

const Separator = styled.span(({ theme }) => ({
  flexShrink: 0,
  padding: `0 ${theme.spacing.sm}`,
  color: theme.color.text.tertiary,
  ...typographyStyle(theme, LABEL_TYPOGRAPHY),
}));

const Segment = styled.input(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  margin: 0,
  padding: `0 ${theme.spacing.xs}`,
  border: 0,
  outline: "none",
  borderRadius: theme.radius.s,
  background: "transparent",
  color: theme.color.text.primary,
  textAlign: "center",
  caretColor: theme.color.text.brand,
  ...typographyStyle(theme, LABEL_TYPOGRAPHY),

  "&::placeholder": {
    color: theme.color.text.quaternary,
  },

  "&:focus": {
    backgroundColor: theme.color.bg.subtle,
  },
}));

const Message = styled.p<{ $error: boolean }>(({ theme, $error }) => ({
  margin: 0,
  color: $error ? theme.color.text.danger : theme.color.text.tertiary,
  ...typographyStyle(theme, INFO_TYPOGRAPHY),
}));
