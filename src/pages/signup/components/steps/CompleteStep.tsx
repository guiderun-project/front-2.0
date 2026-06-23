import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Graphic, Text } from '@/components';

import { SIGNUP_COPY } from '@/pages/signup/copy';

export const CompleteStep = (): ReactElement => {
  return (
    <Wrapper>
      <Graphic aria-hidden={true} graphic="congrats" />
      <Text align="center" as="h1" color="text.primary" font="heading-m-b">
        {SIGNUP_COPY.complete.title}
      </Text>
      <Body align="center" color="text.tertiary" font="body-m-m">
        {SIGNUP_COPY.complete.body}
      </Body>
      <Text align="center" color="text.brand" font="body-m-sb">
        {SIGNUP_COPY.complete.highlight}
      </Text>
    </Wrapper>
  );
};

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.lg,
  padding: `${theme.spacing['6xl']} ${theme.spacing['2xl']}`,
}));

const Body = styled(Text)({
  whiteSpace: 'pre-line',
});
