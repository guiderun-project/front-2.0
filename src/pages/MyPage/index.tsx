import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { PageLayout, Text } from '@/components';

export const MyPage = (): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <PlaceholderSection>
        <Text as="h1" font="heading-s-sb">
          마이페이지
        </Text>
        <Text as="p" color="text.tertiary" font="body-s-r">
          마이페이지 화면은 이후 실제 페이지 구현에 맞춰 연결될 예정입니다.
        </Text>
      </PlaceholderSection>
    </PageLayout>
  );
};

const PlaceholderSection = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing['4xl']} ${theme.spacing['2xl']}`};
`;
