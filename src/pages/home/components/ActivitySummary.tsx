import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText, Text } from '@/components';

import { useHomeSummary } from '../hooks/useHomeSummary';

const HEADLINE = '올해도 러너들은 열심히 달리고 있어요';

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

/**
 * 메인 활동 요약(비로그인) 섹션.
 * publicSummary의 올해 전체 이벤트 수와 누적 거리를 노출한다.
 * 수치는 색이 아닌 텍스트로 전달하고, 스크린리더에는 자연스러운 문장을 별도로 제공한다.
 */
export const ActivitySummary = (): ReactElement => {
  const headingId = useId();
  const { data, isError, isPending } = useHomeSummary();
  const publicSummary = data?.publicSummary ?? null;

  return (
    <Section aria-busy={isPending} aria-labelledby={headingId}>
      <Text id={headingId} as="h2" color="text.primary" font="heading-m-sb">
        {HEADLINE}
      </Text>

      {/* TODO: 러너 일러스트 에셋 추가 시 장식용(aria-hidden)으로 배치 */}

      <Metrics>
        {publicSummary ? (
          <>
            <span aria-hidden="true">
              <Text as="span" color="text.primary" font="heading-l-b">
                총 {formatNumber(publicSummary.totalEventCount)}회
              </Text>
              <Dot> · </Dot>
              <Text as="span" color="text.brand" font="heading-l-b">
                {formatNumber(publicSummary.totalRunningDistanceKm)}KM
              </Text>
            </span>
            <HiddenText>
              올해 러너들이 함께한 모임 총{' '}
              {formatNumber(publicSummary.totalEventCount)}회, 누적{' '}
              {formatNumber(publicSummary.totalRunningDistanceKm)}킬로미터
            </HiddenText>
          </>
        ) : isError ? (
          <Text align="right" color="text.tertiary" font="body-s-r">
            올해 기록을 불러오지 못했어요.
          </Text>
        ) : (
          <Text aria-hidden="true" align="right" color="text.tertiary" font="heading-l-b">
            총 —회 · —KM
          </Text>
        )}
      </Metrics>
    </Section>
  );
};

const Section = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
}));

const Metrics = styled.div({
  textAlign: 'right',
});

const Dot = styled.span(({ theme }) => ({
  margin: `0 ${theme.spacing.xs}`,
  color: theme.color.text.brand,
}));
