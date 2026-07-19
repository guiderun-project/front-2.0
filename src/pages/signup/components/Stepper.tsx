import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText, Icon, Text } from '@/components';

type StepperProps = {
  steps: readonly string[]; // 단계 라벨 목록 (표시 순서대로)
  current: number; // 현재 단계 (1-based)
  className?: string;
};

type StepStatus = 'complete' | 'current' | 'upcoming';

/**
 * 회원가입 각 단계의 원형 인디케이터와 라벨을 보여준다.
 * 완료 단계는 체크 아이콘, 진행 중 단계는 채워진 원, 대기 단계는 회색 원으로 표시한다.
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
          const status: StepStatus =
            stepNumber < safeCurrent
              ? 'complete'
              : stepNumber === safeCurrent
                ? 'current'
                : 'upcoming';

          return (
            <StepItem
              key={label}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <StepCircle $status={status}>
                {status === 'complete' ? (
                  <Icon color="icon.brand" icon="check-thick-lined" size={16} />
                ) : (
                  <Text
                    font="body-s-sb"
                    color={
                      status === 'current' ? 'text.inverse' : 'text.tertiary'
                    }
                  >
                    {stepNumber}
                  </Text>
                )}
              </StepCircle>
              <StepLabel
                font="detail-s-sb"
                color={status === 'upcoming' ? 'text.quaternary' : 'text.brand'}
              >
                {label}
              </StepLabel>
            </StepItem>
          );
        })}
      </StepList>
    </Nav>
  );
};

const STEP_ITEM_WIDTH = 49;
const CIRCLE_SIZE = 22;
const CONNECTOR_WIDTH = 42;
const CONNECTOR_HEIGHT = 1.4;
const STEP_GAP = 24;
const CIRCLE_INSET = (STEP_ITEM_WIDTH - CIRCLE_SIZE) / 2; // 스텝 내 원의 좌우 여백
// 이전 원 오른쪽 끝 ~ 현재 원 왼쪽 끝 사이에 연결선을 가운데 정렬
const CONNECTOR_LEFT =
  -(STEP_GAP + CIRCLE_INSET) +
  (STEP_GAP + CIRCLE_INSET * 2 - CONNECTOR_WIDTH) / 2;

const Nav = styled.nav(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
}));

const StepList = styled.ol(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.pxToRem(STEP_GAP),
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const StepItem = styled.li(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.sm,
  width: theme.pxToRem(STEP_ITEM_WIDTH),

  // 이전 스텝의 원과 현재 스텝의 원 사이를 잇는 연결선
  '& + &::before': {
    content: '""',
    position: 'absolute',
    top: theme.pxToRem((CIRCLE_SIZE - CONNECTOR_HEIGHT) / 2),
    left: theme.pxToRem(CONNECTOR_LEFT),
    width: theme.pxToRem(CONNECTOR_WIDTH),
    height: theme.pxToRem(CONNECTOR_HEIGHT),
    borderRadius: theme.radius.full,
    backgroundColor: theme.color.border.subtle,
  },
}));

const StepCircle = styled.div<{ $status: StepStatus }>(
  ({ $status, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.pxToRem(CIRCLE_SIZE),
    height: theme.pxToRem(CIRCLE_SIZE),
    borderRadius: theme.radius.full,
    backgroundColor:
      $status === 'complete'
        ? theme.color.bg['brand-soft2']
        : $status === 'current'
          ? theme.color.bg['brand-primary']
          : theme.color.bg.surface,
    transition: 'background-color 180ms ease-out',

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
);

const StepLabel = styled(Text)({
  textAlign: 'center',
  whiteSpace: 'nowrap',
});
