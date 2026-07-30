import { Suspense, lazy } from "react";

import styled from "@emotion/styled";

import mainDarkLottie from "@/assets/lotties/main_dark.json";
import mainLightLottie from "@/assets/lotties/main_light.json";
import { PageLayout, PageTitle, Text } from "@/components";
import { useColorMode } from "@/styles/useColorMode";

const Lottie = lazy(() => import("lottie-react"));

const ComingSoonGraphic = () => {
  const { colorMode } = useColorMode();
  const animationData = colorMode === "dark" ? mainDarkLottie : mainLightLottie;

  return (
    <Suspense fallback={null}>
      <Lottie
        key={colorMode}
        animationData={animationData}
        autoplay={true}
        loop={true}
        style={{ width: "100%", height: "100%" }}
      />
    </Suspense>
  );
};

export const ComingSoonPage = () => {
  return (
    <>
      <PageTitle title="오픈 준비 중" />
      <PageLayout background="bg.subtle" gradient="gradient.bg.brand-main">
        <Content aria-labelledby="coming-soon-title">
          <GraphicBox aria-hidden={true}>
            <ComingSoonGraphic />
          </GraphicBox>
          <CopyGroup>
            <Text
              align="center"
              as="h1"
              font="heading-m-b"
              id="coming-soon-title"
            >
              8월 1일부터 다시 볼 수 있어요!
            </Text>
            <Text align="center" as="p" color="text.secondary" font="body-m-m">
              리뉴얼을 준비하고 있어요.
              <br />
              조금만 기다려주세요.
            </Text>
          </CopyGroup>
        </Content>
      </PageLayout>
    </>
  );
};

const Content = styled.section(({ theme }) => ({
  display: "flex",
  minHeight: "100dvh",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing["2xl"],
  boxSizing: "border-box",
  padding: `${theme.spacing["6xl"]} ${theme.spacing["2xl"]}`,
}));

const GraphicBox = styled.div(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  width: theme.pxToRem(200),
  height: theme.pxToRem(200),
}));

const CopyGroup = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.spacing.md,
  maxWidth: theme.pxToRem(320),
}));
