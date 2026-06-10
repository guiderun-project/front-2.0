import type { ReactElement } from "react";

import styled from "@emotion/styled";

import { ColorModeToggle, Text } from "@/components";

export const HomeHeader = (): ReactElement => {
  return (
    <Header>
      <Text as="h1" color="text.primary" font="heading-m-sb">
        홈화면
      </Text>
      <ColorModeToggle aria-label="화면 테마 전환" />
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
