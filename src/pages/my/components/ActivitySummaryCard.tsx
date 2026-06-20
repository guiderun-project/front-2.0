import { Fragment, type ReactElement } from 'react';

import styled from '@emotion/styled';

import type { MyPageResponse } from '@/api/types';
import { Button, Text } from '@/components';

type ActivitySummaryCardProps = {
  participation: MyPageResponse['participation'];
  onViewActivity?: () => void;
};

export const ActivitySummaryCard = ({
  participation,
  onViewActivity,
}: ActivitySummaryCardProps): ReactElement => {
  const breakdown = [
    { label: '대회', count: `${participation.competitionCount}회` },
    { label: '훈련', count: `${participation.trainingCount}회` },
  ];

  return (
    <Card>
      <Stats>
        <TotalGroup>
          <Text align="center" color="text.tertiary" font="body-m-m">
            참여 횟수
          </Text>
          <Text color="text.primary" font="heading-s-sb">
            총 {participation.totalCount}회
          </Text>
        </TotalGroup>
        <Divider aria-hidden={true} />
        <Breakdown>
          {breakdown.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 ? (
                <Text color="text.secondary" font="body-m-m">
                  ・
                </Text>
              ) : null}
              <BreakdownItem>
                <Text color="text.secondary" font="body-m-m">
                  {item.label}
                </Text>
                <Text color="text.secondary" font="body-m-m">
                  {item.count}
                </Text>
              </BreakdownItem>
            </Fragment>
          ))}
        </Breakdown>
      </Stats>
      <ViewActivityButton fullWidth level="quaternary" onClick={onViewActivity}>
        나의 활동 보기
      </ViewActivityButton>
    </Card>
  );
};

const Card = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing['2xl'],
  width: '100%',
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.bg.surface,
}));

const Stats = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  paddingTop: theme.spacing.md,
}));

// 남는 공간만 차지 (디자인: flex 1 0 0, 137px)
const TotalGroup = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 0 0',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const Divider = styled.div(({ theme }) => ({
  flexShrink: 0,
  width: theme.pxToRem(1),
  height: theme.pxToRem(51),
  backgroundColor: theme.color.border.subtle,
}));

// 내용 너비 유지 (디자인: shrink 0 + 좌우 padding 3xl, 174px)
const Breakdown = styled.div(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  height: '100%',
  alignItems: 'center',
  paddingInline: theme.spacing['3xl'],
  whiteSpace: 'nowrap',
}));

const BreakdownItem = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.s,
}));

const ViewActivityButton = styled(Button)(({ theme }) => ({
  height: theme.pxToRem(48),
}));
