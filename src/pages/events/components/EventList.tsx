import type { ReactElement } from "react";

import styled from "@emotion/styled";

import { PageLayout, Text } from "@/components";

export const EventList = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <Header>
        <Text as="h1" color="text.primary" font="heading-m-sb">
          전체 모임
        </Text>
      </Header>
    </PageLayout>
  );
};

const Header = styled.header(({ theme }) => ({
  padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
}));
