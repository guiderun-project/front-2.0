import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { Button, Text } from '@/components';

type SelectOption<T extends string | boolean> = {
  value: T;
  label: string;
};

type SelectCardGroupProps<T extends string | boolean> = {
  ariaLabel: string;
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  errorText?: string;
};

// 참여유형·성별·경험 유무처럼 카드형 버튼 중 하나를 고르는 단일 선택 그룹.
export const SelectCardGroup = <T extends string | boolean>({
  ariaLabel,
  options,
  value,
  onChange,
  errorText,
}: SelectCardGroupProps<T>): ReactElement => {
  const errorId = useId();
  const hasError = Boolean(errorText);

  return (
    <Wrapper>
      <Group
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError || undefined}
        aria-label={ariaLabel}
        role="radiogroup"
      >
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <Button
              key={String(option.value)}
              aria-checked={selected}
              fullWidth
              leftIcon={selected ? { icon: 'check-lined' } : undefined}
              level="line-type"
              role="radio"
              size="l"
              status={selected ? 'selected' : 'default'}
              type="button"
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </Group>
      {hasError ? (
        <Text color="text.danger" font="detail-m-r" id={errorId} role="alert">
          {errorText}
        </Text>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.s,
}));

const Group = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
}));
