import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText, Text } from '@/components';

type StepperProps = {
  steps: readonly string[]; // 단계 라벨 목록 (표시 순서대로)
  current: number; // 현재 단계 (1-based)
  className?: string;
};

/**
 * 회원가입 각 단계의 진행 바와 번호·라벨을 보여준다.
 * 현재 단계까지(완료 단계 포함)의 바와 라벨을 brand 색으로 표시한다.
 */
export const Stepper = ({
  steps,
  current,
  className,
}: StepperProps): ReactElement => {
  const total = steps.length;
  const safeCurrent = Math.min(Math.max(current, 1), total);

  return (
    <Nav aria-label="회원가입 단계" className={className}>
      <HiddenText>{`총 ${total}단계 중 ${safeCurrent}단계 진행 중`}</HiddenText>
      <StepList>
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === safeCurrent;
          const isFilled = stepNumber <= safeCurrent;

          return (
            <StepItem key={label} aria-current={isCurrent ? 'step' : undefined}>
              <ProgressBar $filled={isFilled} aria-hidden="true" />
              <StepLabel
                font="detail-s-sb"
                color={isFilled ? 'text.brand' : 'text.quaternary'}
              >
                <span>{stepNumber}</span>
                <span>{label}</span>
              </StepLabel>
            </StepItem>
          );
        })}
      </StepList>
    </Nav>
  );
};

const Nav = styled.nav(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
}));

const StepList = styled.ol(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.pxToRem(5),
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const StepItem = styled.li(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.pxToRem(7.04),
  minWidth: 0,
}));

const ProgressBar = styled.div<{ $filled: boolean }>(({ $filled, theme }) => ({
  width: '100%',
  height: theme.pxToRem(3),
  borderRadius: theme.pxToRem(50),
  backgroundColor: $filled
    ? theme.color.bg['brand-primary']
    : theme.color.bg.overlay,
  transition: 'background-color 180ms ease-out',

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));

const StepLabel = styled(Text)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.s,
  width: '100%',
  textAlign: 'center',
  whiteSpace: 'nowrap',
}));
