import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText, Text } from '@/components';

import runnerImageUrl from '@/assets/images/home-summary-runner.png';

import { useHomeSummary } from '../hooks/useHomeSummary';

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

/**
 * 메인 활동 요약(비로그인) 섹션.
 * publicSummary의 올해 전체 이벤트 수와 누적 거리를 노출한다.
 * 수치는 색이 아닌 텍스트로 전달하고, 스크린리더에는 자연스러운 문장을 별도로 제공한다.
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
        <Headline id={headingId} as="h2" color="text.primary" font="heading-m-r">
          올해도{' '}
          <Text as="strong" color="text.primary" font="heading-m-sb">
            러너들은
          </Text>
          <br />
          열심히 달리고 있어요
        </Headline>
        <RunnerImage alt="" aria-hidden={true} src={runnerImageUrl} />
      </HeadlineRow>

      <Metrics>
        <span aria-hidden="true">
          <Text as="span" color="text.primary" font="display-l">
            총 {formatNumber(publicSummary.totalEventCount)}회
          </Text>
          <Dot> · </Dot>
          <Text as="span" color="text.brand" font="display-l">
            {formatNumber(publicSummary.totalRunningDistanceKm)}KM
          </Text>
        </span>
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
  gap: theme.spacing.lg,
}));

const HeadlineRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.lg,
}));

const Headline = styled(Text)({
  flex: '1 1 auto',
  minWidth: 0,
});

const RunnerImage = styled.img(({ theme }) => ({
  flexShrink: 0,
  width: theme.pxToRem(120),
  height: 'auto',
}));

const Metrics = styled.div({
  textAlign: 'right',
});

const Dot = styled.span(({ theme }) => ({
  margin: `0 ${theme.spacing.s}`,
  color: theme.color.text.tertiary,
  fontSize: theme.typography['heading-m-sb'].fontSize,
  verticalAlign: 'middle',
}));
