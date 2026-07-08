import type { ChangeEvent, ReactElement } from "react";
import { Fragment, useId, useRef, useState } from "react";

import styled from "@emotion/styled";

import {
  CONTROL_TOP_SPACE,
  FIELD_MIN_HEIGHT,
  INFO_TYPOGRAPHY,
  LABEL_TYPOGRAPHY,
  typographyStyle,
} from "./fieldStyles";
import type { TimeInputProps, TimeValue } from "./Input.types";

const SEGMENT_PLACEHOLDER = "--";

// 스크린리더에 시/분/초 입력 형식을 안내한다.
const FORMAT_HINT = "시간 분 초 형식으로 입력해주세요";

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

// 분/초는 0~59만 유효하다. (시는 상한을 두지 않는다.)
const MINUTE_SECOND_MAX = 59;
const CAPPED_SEGMENT_KEYS: ReadonlySet<SegmentKey> = new Set(["minutes", "seconds"]);

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
  const formatHintId = `${reactId}-format`;
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
      const digits = event.target.value
        .replace(/\D/g, "")
        .slice(0, MAX_SEGMENT_LENGTH);

      // 분/초는 0~59만 허용한다. 십의 자리는 0~5만 유효하므로 첫 자리가 6~9면
      // 그 자체로 완성된 값(6~9초/분)으로 보고 다음 칸으로 넘기고, 두 자리 값이
      // 59를 넘으면 59로 맞춘다. (에러 메시지 없이 입력 자체를 제한)
      let next = digits;
      let isComplete = digits.length === MAX_SEGMENT_LENGTH;

      if (CAPPED_SEGMENT_KEYS.has(key)) {
        const maxTensDigit = Math.floor(MINUTE_SECOND_MAX / 10); // 5
        if (digits.length === 1 && Number(digits) > maxTensDigit) {
          isComplete = true;
        } else if (Number(digits) > MINUTE_SECOND_MAX) {
          next = String(MINUTE_SECOND_MAX);
          isComplete = true;
        }
      }

      commit({ ...current, [key]: next });

      if (isComplete && index < SEGMENTS.length - 1) {
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
    // 러닝 그룹 동기화를 위해 기록은 반드시 시→분→초 순서로 채워야 한다.
    // 분/초 칸을 직접 눌러 그쪽부터 입력되면 유효성 검사(6자리)에서 걸리므로,
    // 어느 위치를 눌러도 항상 '시' 칸으로 포커스를 보낸다. (자동 이동은 그대로 동작)
    event.preventDefault();
    segmentRefs.current[0]?.focus();
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
          aria-describedby={[formatHintId, hasMessage ? messageId : null]
            .filter(Boolean)
            .join(" ")}
          aria-labelledby={labelId}
          data-segments=""
          role="group"
        >
          {SEGMENTS.map((segment, index) => (
            <Fragment key={segment.key}>
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
            </Fragment>
          ))}
        </SegmentRow>
      </FieldBox>
      {hasMessage && (
        <Message
          $error={hasError}
          data-helper={!hasError || undefined}
          id={messageId}
        >
          {message}
        </Message>
      )}
      <FormatHint id={formatHintId}>{FORMAT_HINT}</FormatHint>
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
      transform: "translateY(0)",
      transformOrigin: "left top",
      color: theme.color.text.tertiary,
      ...typographyStyle(theme, INFO_TYPOGRAPHY),
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
  transition:
    "transform 120ms ease, color 120ms ease, top 120ms ease, font-size 120ms ease, line-height 120ms ease, letter-spacing 120ms ease",

  "@media (prefers-reduced-motion: reduce)": {
    transition: "color 120ms ease",
  },
}));

const SegmentRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.s,
  width: "100%",
  paddingTop: theme.pxToRem(CONTROL_TOP_SPACE),
}));

const Separator = styled.span(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  width: theme.spacing.sm,
  height: theme.pxToRem(24),
  color: theme.color.text.tertiary,
  ...typographyStyle(theme, LABEL_TYPOGRAPHY),
}));

const Segment = styled.input(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  margin: 0,
  padding: 0,
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

  '&[aria-invalid="true"]': {
    caretColor: theme.color.text.danger,
  },
}));

const Message = styled.p<{ $error: boolean }>(({ theme, $error }) => ({
  margin: 0,
  color: $error ? theme.color.text.danger : theme.color.text.tertiary,
  ...typographyStyle(theme, INFO_TYPOGRAPHY),
}));

// 화면에는 보이지 않고 스크린리더에만 읽히는 형식 안내 텍스트.
const FormatHint = styled.span({
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: 0,
  border: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});
