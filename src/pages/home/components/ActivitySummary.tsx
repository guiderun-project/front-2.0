import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText, Text } from '@/components';

import runnerImageUrl from '@/assets/images/home-summary-runner.png';

import { useHomeSummary } from '../hooks/useHomeSummary';

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

/**
 * 메인 활동 요약(비로그인) 섹션.
 * publicSummary의 올해 전체 이벤트 수와 누적 거리를 노출한다.
 * 헤드라인은 두 줄 고정(각 줄 nowrap), 수치는 색이 아닌 텍스트로 전달하고
 * 스크린리더에는 자연스러운 문장을 별도로 제공한다.
 * 로딩/에러는 상위 Suspense + ErrorBoundary에서 처리한다.
 */
export const ActivitySummary = (): ReactElement => {
  const headingId = useId();
  const {
    data: { publicSummary },
  } = useHomeSummary();

  return (
    <Section aria-labelledby={headingId}>
      <HeadlineRow>
        {/* span 분리로 인해 접근명이 붙어 읽히지 않도록 자연스러운 문장을 명시한다. */}
        <Headline aria-label="올해도 러너들은 열심히 달리고 있어요" id={headingId}>
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

  // 라이트 모드는 원본 색, 다크 모드에서는 흰색으로 보이도록 반전한다.
  // (명시적 다크 토글 + 시스템 다크 둘 다 대응)
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
