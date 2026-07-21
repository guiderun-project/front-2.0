import type { ChangeEvent, ReactElement } from "react";
import { Fragment, useId, useRef, useState } from "react";

import styled from "@emotion/styled";

import { HiddenText } from "@/components/HiddenText";

import {
  CONTROL_TOP_SPACE,
  FIELD_MIN_HEIGHT,
  INFO_TYPOGRAPHY,
  LABEL_TYPOGRAPHY,
  typographyStyle,
} from "./fieldStyles";
import { FieldLabelContent } from "./FieldLabelContent";
import type { TimeInputProps, TimeValue } from "./Input.types";
import { useFieldErrorAnnouncement } from "./useFieldErrorAnnouncement";

type SegmentKey = "hours" | "minutes" | "seconds";

const EMPTY_TIME: TimeValue = { hours: "", minutes: "", seconds: "" };

const SEGMENTS: ReadonlyArray<{
  key: SegmentKey;
  label: string;
  placeholder: string;
}> = [
  { key: "hours", label: "시", placeholder: "HH" },
  { key: "minutes", label: "분", placeholder: "MM" },
  { key: "seconds", label: "초", placeholder: "SS" },
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
  requirement,
}: TimeInputProps): ReactElement => {
  const reactId = useId();
  const labelId = `${reactId}-label`;
  const messageId = `${reactId}-message`;
  const segmentRefs = useRef<Array<HTMLInputElement | null>>([]);
  const segmentRowRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<TimeValue>(
    defaultValue ?? EMPTY_TIME,
  );
  const current = isControlled ? value : internalValue;

  const hasError = Boolean(errorText);
  const message = hasError ? errorText : helperText;
  const hasMessage = Boolean(message);
  const hasValue = Boolean(current.hours || current.minutes || current.seconds);
  // 오류는 aria-describedby 외에 상시 마운트된 라이브 리전으로도 미러링해야
  // 포커스가 다른 곳에 있을 때 나타나는 오류를 스크린리더가 놓치지 않는다.
  // 단, 오류 등장 직후 세그먼트로 포커스가 옮겨온 검증-포커스 흐름에서는
  // describedby가 낭독을 담당하므로 미러를 생략한다(중복 낭독 방지).
  const errorAnnouncement = useFieldErrorAnnouncement(
    hasError ? errorText : null,
    segmentRowRef,
  );

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

  // 박스 여백/구분자/라벨을 클릭하면 미완성 칸의 끝(비어 있으면 맨 앞)으로
  // 포커스를 고정해 세 칸을 하나의 인풋처럼 다룬다. 단, 세그먼트 input을 직접
  // 탭한 경우에는 브라우저 기본 포커스를 존중한다 — 스크린리더 더블탭은
  // 접근성 포커스된 칸의 중앙에 합성 탭을 보내므로, 여기서 preventDefault 후
  // 다른 칸으로 리다이렉트하면 VoiceOver/TalkBack 사용자가 선택한 칸이 아닌
  // 칸으로 포커스가 튕긴다.
  //
  // 세그먼트가 보이지 않는 상태(비어 있고 포커스도 없어 opacity:0)에서는
  // FieldBox 스타일이 [data-segments]의 pointer-events를 꺼서 탭이 이 핸들러로
  // 떨어지게 한다. 덕분에 "빈 필드" 탭은 위치와 무관하게 첫 미완성 칸(시)으로
  // 리다이렉트되고, 편집 중이거나 값이 있어 세그먼트가 보일 때만 직접 탭이
  // 기본 포커스를 따른다.
  const handleBoxPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ): void => {
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    event.preventDefault();
    const firstIncompleteIndex = SEGMENTS.findIndex(
      (segment) => current[segment.key].length < MAX_SEGMENT_LENGTH,
    );
    const targetIndex =
      firstIncompleteIndex === -1 ? SEGMENTS.length - 1 : firstIncompleteIndex;
    const target = segmentRefs.current[targetIndex];
    target?.focus();
    const end = target?.value.length ?? 0;
    target?.setSelectionRange(end, end);
  };

  return (
    <Root className={className} data-error={hasError || undefined}>
      <FieldBox
        data-filled={hasValue || undefined}
        onPointerDown={handleBoxPointerDown}
      >
        <FloatingLabel data-floating-label="" id={labelId}>
          <FieldLabelContent label={label} requirement={requirement} />
        </FloatingLabel>
        <SegmentRow
          aria-labelledby={labelId}
          data-segments=""
          ref={segmentRowRef}
          role="group"
        >
          {SEGMENTS.map((segment, index) => (
            <Fragment key={segment.key}>
              {index > 0 && <Separator aria-hidden="true">:</Separator>}
              <Segment
                // 메시지는 각 칸의 aria-describedby로만 연결한다. 그룹에도 함께
                // 걸면 데스크톱 스크린리더가 그룹 진입 시와 칸 포커스 시 같은
                // 메시지를 연속 두 번 낭독한다. 그룹의 aria-labelledby는 그룹
                // 진입 시 라벨 컨텍스트 제공용으로만 남긴다(모바일 스크린리더는
                // 그룹 속성을 input 포커스 시 낭독하지 않아 칸에 직접 연결).
                aria-describedby={hasMessage ? messageId : undefined}
                aria-invalid={hasError || undefined}
                aria-label={`${label} ${segment.label}`}
                inputMode="numeric"
                maxLength={MAX_SEGMENT_LENGTH}
                onChange={handleSegmentChange(index, segment.key)}
                onFocus={handleSegmentFocus}
                onKeyDown={handleSegmentKeyDown(index, segment.key)}
                placeholder={segment.placeholder}
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
      <HiddenText role="status">{errorAnnouncement}</HiddenText>
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

  // 세그먼트가 숨겨진 동안(pointerEvents: none)에는 탭이 FieldBox로 떨어져
  // 첫 미완성 칸 리다이렉트(handleBoxPointerDown)가 동작하고, 보이는 동안에만
  // 세그먼트 직접 탭이 브라우저 기본 포커스를 따른다.
  "& [data-segments]": {
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 120ms ease",
  },

  '&:focus-within [data-segments], &[data-filled="true"] [data-segments]': {
    opacity: 1,
    pointerEvents: "auto",
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
