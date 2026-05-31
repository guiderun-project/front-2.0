import type { ChangeEvent, KeyboardEvent, ReactElement, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';

import styled from '@emotion/styled';

import {
  CONTROL_TOP_SPACE,
  FIELD_MIN_HEIGHT,
  FLOATED_LABEL_SCALE,
  INFO_TYPOGRAPHY,
  LABEL_TYPOGRAPHY,
  typographyStyle,
} from './fieldStyles';

const SEGMENT_PLACEHOLDER = '--';

type SegmentKey = 'hours' | 'minutes' | 'seconds';

export type TimeValue = {
  hours: string;
  minutes: string;
  seconds: string;
};

const EMPTY_TIME: TimeValue = { hours: '', minutes: '', seconds: '' };

const SEGMENTS: ReadonlyArray<{ key: SegmentKey; label: string; max: number }> = [
  { key: 'hours', label: '시', max: 99 },
  { key: 'minutes', label: '분', max: 59 },
  { key: 'seconds', label: '초', max: 59 },
];

export type TimeInputProps = {
  label: string;
  helperText?: ReactNode;
  errorText?: ReactNode;
  value?: TimeValue;
  defaultValue?: TimeValue;
  onChange?: (value: TimeValue) => void;
  className?: string;
};

const sanitizeSegment = (raw: string, max: number, previous: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 2);
  if (digits.length === 2 && Number(digits) > max) {
    return previous;
  }
  return digits;
};

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
  const [internalValue, setInternalValue] = useState<TimeValue>(defaultValue ?? EMPTY_TIME);
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
    (index: number) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { key, max } = SEGMENTS[index];
      const sanitized = sanitizeSegment(event.target.value, max, current[key]);
      commit({ ...current, [key]: sanitized });

      if (sanitized.length === 2 && index < SEGMENTS.length - 1) {
        segmentRefs.current[index + 1]?.focus();
      }
    };

  const handleSegmentKeyDown =
    (index: number) =>
    (event: KeyboardEvent<HTMLInputElement>): void => {
      const target = event.currentTarget;
      const isCaretAtStart = target.selectionStart === 0 && target.selectionEnd === 0;
      if (event.key === 'Backspace' && isCaretAtStart && index > 0) {
        segmentRefs.current[index - 1]?.focus();
      }
    };

  const handleBoxPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      segmentRefs.current[0]?.focus();
    }
  };

  return (
    <Root className={className} data-error={hasError || undefined}>
      <FieldBox data-filled={hasValue || undefined} onPointerDown={handleBoxPointerDown}>
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
                onChange={handleSegmentChange(index)}
                onKeyDown={handleSegmentKeyDown(index)}
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
        <Message $error={hasError} id={messageId} role={hasError ? 'alert' : undefined}>
          {message}
        </Message>
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
  minHeight: theme.pxToRem(FIELD_MIN_HEIGHT),
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.color.border.default}`,
  backgroundColor: theme.color.bg.default,
  transition: 'border-color 120ms ease, box-shadow 120ms ease',

  '&:focus-within': {
    borderColor: theme.color.border.brand,
    boxShadow: `inset 0 0 0 1px ${theme.color.border.brand}`,
  },

  '&:focus-within [data-floating-label], &[data-filled="true"] [data-floating-label]': {
    top: theme.spacing.lg,
    transform: `translateY(0) scale(${FLOATED_LABEL_SCALE})`,
    transformOrigin: 'left top',
    color: theme.color.text.tertiary,
  },

  '&:focus-within [data-floating-label]': {
    color: theme.color.text.brand,
  },

  '& [data-segments]': {
    opacity: 0,
    transition: 'opacity 120ms ease',
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

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',

    '& [data-segments]': {
      transition: 'none',
    },
  },
}));

const FloatingLabel = styled.span(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing.xl,
  top: '50%',
  maxWidth: `calc(100% - ${theme.spacing.xl} * 2)`,
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

const SegmentRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  paddingTop: theme.pxToRem(CONTROL_TOP_SPACE),
}));

const SegmentSlot = styled.div({
  display: 'flex',
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
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
  outline: 'none',
  borderRadius: theme.radius.s,
  background: 'transparent',
  color: theme.color.text.primary,
  textAlign: 'center',
  caretColor: theme.color.text.brand,
  ...typographyStyle(theme, LABEL_TYPOGRAPHY),

  '&::placeholder': {
    color: theme.color.text.quaternary,
  },

  '&:focus': {
    backgroundColor: theme.color.bg.subtle,
  },
}));

const Message = styled.p<{ $error: boolean }>(({ theme, $error }) => ({
  margin: 0,
  color: $error ? theme.color.text.danger : theme.color.text.tertiary,
  ...typographyStyle(theme, INFO_TYPOGRAPHY),
}));
