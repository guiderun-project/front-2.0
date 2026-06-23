import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Button } from '@/components';

type SelectOption<T extends string | boolean> = {
  value: T;
  label: string;
};

type SelectCardGroupProps<T extends string | boolean> = {
  ariaLabel: string;
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

// 참여유형·성별·경험 유무처럼 카드형 버튼 중 하나를 고르는 단일 선택 그룹.
export const SelectCardGroup = <T extends string | boolean>({
  ariaLabel,
  options,
  value,
  onChange,
}: SelectCardGroupProps<T>): ReactElement => {
  return (
    <Group aria-label={ariaLabel} role="radiogroup">
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
  );
};

const Group = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
}));
