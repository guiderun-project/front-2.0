import {
  useId,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type ReactElement,
  type Ref,
} from 'react';

import styled from '@emotion/styled';

import type { InputProps } from '@/components/Input/Input.types';

import { RUNNING_DISTANCE_MAX_LENGTH } from '../constants';
import { formatRunningDistanceInput } from '../utils';

type RunningDistanceInputProps = Omit<
  InputProps,
  'defaultValue' | 'inputMode' | 'maxLength' | 'onChange' | 'trailing' | 'value'
> & {
  value: string;
  onChange?: (value: string) => void;
};

const assignRef = (
  ref: Ref<HTMLInputElement> | undefined,
  node: HTMLInputElement | null,
): void => {
  if (!ref) {
    return;
  }

  if (typeof ref === 'function') {
    ref(node);
    return;
  }

  ref.current = node;
};

export const RunningDistanceInput = ({
  controlRef,
  describedById,
  errorText,
  helperText,
  label,
  value,
  onChange,
  placeholder,
  ...inputProps
}: RunningDistanceInputProps): ReactElement => {
  const reactId = useId();
  const controlId = `${reactId}-control`;
  const messageId = `${reactId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const message = errorText ?? helperText;
  const hasError = Boolean(errorText);
  const characterCount = Math.max(
    value.length,
    placeholder?.length ?? 0,
    1,
  );
  const describedBy =
    [message ? messageId : null, describedById ?? null]
      .filter(Boolean)
      .join(' ') || undefined;

  useLayoutEffect(() => {
    assignRef(controlRef, inputRef.current);

    return () => {
      assignRef(controlRef, null);
    };
  }, [controlRef]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(formatRunningDistanceInput(event.target.value));
  };

  return (
    <Root data-error={hasError || undefined}>
      <FieldBox $hasError={hasError}>
        <Label htmlFor={controlId}>{label}</Label>
        <ContentRow>
          <DistanceInput
            {...inputProps}
            ref={inputRef}
            $characterCount={characterCount}
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            id={controlId}
            inputMode="decimal"
            maxLength={RUNNING_DISTANCE_MAX_LENGTH}
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={handleChange}
          />
          <UnitText aria-hidden="true">km</UnitText>
        </ContentRow>
      </FieldBox>
      {message ? (
        <Message
          $error={hasError}
          data-helper={!hasError || undefined}
          id={messageId}
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </Message>
      ) : null}
    </Root>
  );
};

const Root = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  width: '100%',

  '&:focus-within [data-helper]': {
    color: theme.color.text.brand,
  },
}));

const FieldBox = styled.div<{ $hasError: boolean }>(
  ({ $hasError, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: theme.spacing.s,
    minHeight: theme.pxToRem(74),
    padding: theme.spacing.xl,
    border: `${theme.pxToRem(1)} solid ${
      $hasError ? theme.color.border.danger : theme.color.border.default
    }`,
    borderRadius: theme.radius.md,
    boxSizing: 'border-box',
    backgroundColor: theme.color.bg.default,
    transition: 'border-color 120ms ease, box-shadow 120ms ease',

    '&:focus-within': {
      borderColor: $hasError
        ? theme.color.border.danger
        : theme.color.border.brand,
      boxShadow: `inset 0 0 0 1px ${
        $hasError ? theme.color.border.danger : theme.color.border.brand
      }`,
    },
  }),
);

const Label = styled.label(({ theme }) => ({
  ...theme.typography['detail-m-m'],
  color: theme.color.text.tertiary,
  cursor: 'text',
}));

const ContentRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
  width: '100%',
  height: theme.pxToRem(28),
  overflow: 'hidden',
}));

const DistanceInput = styled.input<{ $characterCount: number }>(
  ({ $characterCount, theme }) => ({
    ...theme.typography['heading-s-m'],
    width: `calc(${$characterCount}ch + ${theme.spacing.xs})`,
    minWidth: theme.pxToRem(12),
    maxWidth: '100%',
    padding: 0,
    border: 0,
    backgroundColor: 'transparent',
    color: theme.color.text.primary,
    outline: 0,

    '&::placeholder': {
      color: theme.color.text.tertiary,
    },
  }),
);

const UnitText = styled.span(({ theme }) => ({
  ...theme.typography['heading-s-m'],
  flex: '0 0 auto',
  color: theme.color.text.primary,
}));

const Message = styled.p<{ $error: boolean }>(({ $error, theme }) => ({
  ...theme.typography['body-s-m'],
  margin: 0,
  color: $error ? theme.color.text.danger : theme.color.text.tertiary,
}));
