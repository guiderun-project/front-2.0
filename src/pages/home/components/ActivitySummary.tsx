import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText, Text } from '@/components';
import { useAuth } from '@/contexts';

import runnerImageUrl from '@/assets/images/home-summary-runner.png';

import { useHomeSummary } from '../hooks/useHomeSummary';

// TODO: 회원 헤드라인 2번째 줄 실제 카피 확정 후 반영
const MEMBER_HEADLINE_SUBTITLE = '오늘도 함께 달릴 준비됐어요';

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

export const ActivitySummary = (): ReactElement => {
  const headingId = useId();
  const { user } = useAuth();
  const {
    data: { mySummary, publicSummary },
  } = useHomeSummary();

  if (mySummary && user) {
    return (
      <Section aria-labelledby={headingId}>
        <HeadlineRow>
          <Headline id={headingId}>
            <NameLine>
              <Text as="span" color="text.primary" font="heading-m-sb">
                {user.name}님
              </Text>
              <Text as="span" color="text.primary" font="heading-m-r">
                은
              </Text>
            </NameLine>
            <Text as="span" color="text.primary" font="heading-m-r">
              {MEMBER_HEADLINE_SUBTITLE}
            </Text>
          </Headline>
          <RunnerImageBox aria-hidden={true}>
            <RunnerImage alt="" src={runnerImageUrl} />
          </RunnerImageBox>
        </HeadlineRow>

        <Metrics>
          <Text aria-hidden={true} as="span" color="text.primary" font="display-l">
            총 {formatNumber(mySummary.totalParticipationCount)}회
          </Text>
          <MetricDot aria-hidden={true} />
          <Text aria-hidden={true} as="span" color="text.brand" font="display-l">
            {formatNumber(mySummary.totalRunningDistanceKm)}KM
          </Text>
          <HiddenText>
            지금까지 함께한 모임 총{' '}
            {formatNumber(mySummary.totalParticipationCount)}회, 누적{' '}
            {formatNumber(mySummary.totalRunningDistanceKm)}킬로미터
          </HiddenText>
        </Metrics>
      </Section>
    );
  }

  return (
    <Section aria-labelledby={headingId}>
      <HeadlineRow>
        <Headline id={headingId}>
          <TitleLine>
            <Text as="span" color="text.primary" font="heading-m-r">
              올해도
            </Text>
            <Text as="span" color="text.primary" font="heading-m-sb">
              러너들은
            </Text>
          </TitleLine>
          <Text as="span" color="text.primary" font="heading-m-r">
            열심히 달리고 있어요
          </Text>
        </Headline>
        <RunnerImageBox aria-hidden={true}>
          <RunnerImage alt="" src={runnerImageUrl} />
        </RunnerImageBox>
      </HeadlineRow>

      <Metrics>
        <Text aria-hidden={true} as="span" color="text.primary" font="display-l">
          총 {formatNumber(publicSummary.totalEventCount)}회
        </Text>
        <MetricDot aria-hidden={true} />
        <Text aria-hidden={true} as="span" color="text.brand" font="display-l">
          {formatNumber(publicSummary.totalRunningDistanceKm)}KM
        </Text>
        <HiddenText>
          올해 러너들이 함께한 모임 총{' '}
          {formatNumber(publicSummary.totalEventCount)}회, 누적{' '}
          {formatNumber(publicSummary.totalRunningDistanceKm)}킬로미터
        </HiddenText>
      </Metrics>
    </Section>
  );
};

const Section = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['2xl'],
}));

const HeadlineRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing.xl,
  width: '100%',
}));

const Headline = styled.h2(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  margin: 0,
  minWidth: 0,
  whiteSpace: 'nowrap',
}));

const TitleLine = styled.span(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing.s,
}));

const NameLine = styled.span({
  display: 'flex',
  alignItems: 'flex-end',
});

const RunnerImageBox = styled.span(({ theme }) => ({
  position: 'relative',
  flexShrink: 0,
  width: theme.pxToRem(94),
  height: theme.pxToRem(64),
  overflow: 'hidden',
}));

const RunnerImage = styled.img(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: theme.pxToRem(140),
  height: theme.pxToRem(140),
  transform: 'translate(-50%, -50%)',

  filter: 'none',

  "html[data-color-mode='dark'] &": {
    filter: 'brightness(0) invert(1)',
  },

  '@media (prefers-color-scheme: dark)': {
    "html:not([data-color-mode='light']) &": {
      filter: 'brightness(0) invert(1)',
    },
  },
}));

const Metrics = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing.md,
  width: '100%',
}));

const MetricDot = styled.span(({ theme }) => ({
  flexShrink: 0,
  width: theme.pxToRem(4),
  height: theme.pxToRem(4),
  borderRadius: theme.pxToRem(1),
  backgroundColor: theme.color.text.primary,
}));
