import type { ReactElement } from "react";

import styled from "@emotion/styled";

import { Graphic, HiddenText, Text } from "@/components";
import { useAuth } from "@/contexts";
import { useHomeSummary } from "@/pages/home/hooks/useHomeSummary";
import { getRunnerStageHeadline } from "@/pages/home/utils";

const formatNumber = (value: number) => value.toLocaleString("ko-KR");

export const ActivitySummary = (): ReactElement => {
  const { user } = useAuth();
  const {
    data: { mySummary, publicSummary },
  } = useHomeSummary();

  if (mySummary && user) {
    const stageHeadline = getRunnerStageHeadline(
      mySummary.totalParticipationCount,
    );
    const participationCount = formatNumber(mySummary.totalParticipationCount);
    const runningDistanceKm = formatNumber(mySummary.totalRunningDistanceKm);
    const metricsLabel = `지금까지 함께한 모임 총 ${participationCount}회, 누적 ${runningDistanceKm}킬로미터`;

    return (
      <Section>
        <HeadlineRow>
          <Headline>
            <HiddenText>
              {`${user.name}님${stageHeadline.connector} ${stageHeadline.body}`}
            </HiddenText>
            <NameLine aria-hidden={true}>
              <Text as="span" color="text.primary" font="heading-m-sb">
                {user.name}님
              </Text>
              <Text as="span" color="text.primary" font="heading-m-r">
                {stageHeadline.connector}
              </Text>
            </NameLine>
            <HeadlineBody
              aria-hidden={true}
              as="span"
              color="text.primary"
              font="heading-m-r"
            >
              {stageHeadline.body}
            </HeadlineBody>
          </Headline>
          <RunnerGraphicBox aria-hidden={true}>
            <Graphic aria-hidden={true} color="icon.primary" graphic="main" />
          </RunnerGraphicBox>
        </HeadlineRow>

        <Metrics>
          <HiddenText>{metricsLabel}</HiddenText>
          <VisibleMetrics aria-hidden={true}>
            <Text as="span" color="text.primary" font="display-l">
              총 {participationCount}회
            </Text>
            <MetricDot />
            <Text as="span" color="text.brand" font="display-l">
              {runningDistanceKm}KM
            </Text>
          </VisibleMetrics>
        </Metrics>
      </Section>
    );
  }

  const eventCount = formatNumber(publicSummary.totalEventCount);
  const runningDistanceKm = formatNumber(publicSummary.totalRunningDistanceKm);
  const metricsLabel = `올해 러너들이 함께한 모임 총 ${eventCount}회, 누적 ${runningDistanceKm}킬로미터`;

  return (
    <Section>
      <HeadlineRow>
        <Headline>
          <HiddenText>올해도 러너들은 열심히 달리고 있어요</HiddenText>
          <TitleLine aria-hidden={true}>
            <Text as="span" color="text.primary" font="heading-m-r">
              올해도
            </Text>
            <Text as="span" color="text.primary" font="heading-m-sb">
              러너들은
            </Text>
          </TitleLine>
          <Text
            aria-hidden={true}
            as="span"
            color="text.primary"
            font="heading-m-r"
          >
            열심히 달리고 있어요
          </Text>
        </Headline>
        <RunnerGraphicBox aria-hidden={true}>
          <Graphic aria-hidden={true} color="icon.primary" graphic="main" />
        </RunnerGraphicBox>
      </HeadlineRow>

      <Metrics>
        <HiddenText>{metricsLabel}</HiddenText>
        <VisibleMetrics aria-hidden={true}>
          <Text as="span" color="text.primary" font="display-l">
            총 {eventCount}회
          </Text>
          <MetricDot />
          <Text as="span" color="text.brand" font="display-l">
            {runningDistanceKm}KM
          </Text>
        </VisibleMetrics>
      </Metrics>
    </Section>
  );
};

const Section = styled.section(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing["2xl"],
}));

const HeadlineRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  gap: theme.spacing.xl,
  width: "100%",
}));

const Headline = styled.h2(({ theme }) => ({
  display: "flex",
  flex: "1 1 0",
  flexDirection: "column",
  gap: theme.spacing.xs,
  margin: 0,
  minWidth: 0,
  whiteSpace: "nowrap",
}));

const TitleLine = styled.span(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  gap: theme.spacing.s,
}));

const NameLine = styled.span({
  display: "flex",
  alignItems: "flex-end",
});

const HeadlineBody = styled(Text)({
  whiteSpace: "normal",
  wordBreak: "keep-all",
});

const RunnerGraphicBox = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: theme.pxToRem(94),
  height: theme.pxToRem(70),
}));

const Metrics = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing.md,
  width: "100%",
}));

const VisibleMetrics = styled.span(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.md,
}));

const MetricDot = styled.span(({ theme }) => ({
  flexShrink: 0,
  width: theme.pxToRem(4),
  height: theme.pxToRem(4),
  borderRadius: theme.pxToRem(1),
  backgroundColor: theme.color.text.primary,
}));
