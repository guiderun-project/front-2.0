import { useId, useRef, type KeyboardEvent, type ReactElement } from 'react';

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
  const groupRef = useRef<HTMLDivElement>(null);

  // APG 라디오 그룹 패턴의 roving tabindex: 선택된(없으면 첫) 옵션만 Tab 정지점으로 두고,
  // 화살표 키로 옵션 간 포커스 이동과 선택을 함께 처리한다.
  const selectedIndex = options.findIndex((option) => option.value === value);
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? -1
          : 0;
    if (delta === 0) return;

    const radios = groupRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    if (!radios || radios.length === 0) return;
    const currentIndex = Array.prototype.indexOf.call(radios, event.target);
    if (currentIndex === -1) return;

    event.preventDefault();
    const nextIndex = (currentIndex + delta + radios.length) % radios.length;
    radios[nextIndex].focus();
    onChange(options[nextIndex].value);
  };

  return (
    <Wrapper>
      <Group
        ref={groupRef}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError || undefined}
        aria-label={ariaLabel}
        role="radiogroup"
        onKeyDown={handleKeyDown}
      >
        {options.map((option, index) => {
          const selected = value === option.value;

          return (
            <Button
              key={String(option.value)}
              aria-checked={selected}
              fullWidth
              leftIcon={selected ? { icon: 'check-thick-lined' } : undefined}
              level="line-type"
              role="radio"
              size="l"
              status={selected ? 'selected' : 'default'}
              tabIndex={index === tabbableIndex ? 0 : -1}
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
