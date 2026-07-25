import styled from '@emotion/styled';

import { Icon, PageLayout, PageTitle, Text } from '@/components';

export const ComingSoonPage = () => {
  return (
    <>
      <PageTitle title="오픈 준비 중" />
      <PageLayout background="bg.subtle" gradient="gradient.bg.brand-main">
        <Content aria-labelledby="coming-soon-title">
          <Icon
            aria-hidden={true}
            color="icon.tertiary"
            icon="calendar-lined"
            size={64}
          />
          <CopyGroup>
            <Text
              align="center"
              as="h1"
              font="heading-m-b"
              id="coming-soon-title"
            >
              곧 만나요
            </Text>
            <Text align="center" as="p" color="text.secondary" font="body-m-m">
              가이드런을 준비하고 있어요. 조금만 기다려 주세요.
            </Text>
          </CopyGroup>
        </Content>
      </PageLayout>
    </>
  );
};

const Content = styled.section(({ theme }) => ({
  display: 'flex',
  minHeight: '100dvh',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing['2xl'],
  boxSizing: 'border-box',
  padding: `${theme.spacing['6xl']} ${theme.spacing['2xl']}`,
}));

const CopyGroup = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing.md,
  maxWidth: theme.pxToRem(320),
}));
