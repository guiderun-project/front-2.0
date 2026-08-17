import type { ReactElement } from "react";

import styled from "@emotion/styled";

import { ColorModeToggle, ContrastToggle, Text } from "@/components";

export const HomeHeader = (): ReactElement => {
  return (
    <Header>
      <Text as="h1" color="text.primary" font="heading-m-sb">
        홈화면
      </Text>
      <HeaderControls>
        <ContrastToggle aria-label="고대비 모드 전환" />
        <ColorModeToggle aria-label="화면 테마 전환" />
      </HeaderControls>
    </Header>
  );
};

const Header = styled.header(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing.lg,
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
}));

const HeaderControls = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  gap: theme.spacing.md,
}));
