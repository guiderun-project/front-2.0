import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Icon, PageLayout, PageTitle, Text } from '@/components';

export const NotFoundPage = () => {
  return (
    <>
      <PageTitle title="페이지를 찾을 수 없음" />
      <PageLayout background="bg.subtle">
        <Content aria-labelledby="not-found-title">
          <Icon
            aria-hidden={true}
            color="icon.tertiary"
            icon="alert-circle-filled"
            size={64}
          />
          <CopyGroup>
            <Text
              align="center"
              as="h1"
              font="heading-m-b"
              id="not-found-title"
            >
              페이지를 찾을 수 없어요
            </Text>
            <Text align="center" as="p" color="text.secondary" font="body-m-m">
              주소가 잘못되었거나 페이지가 이동되었을 수 있어요.
            </Text>
          </CopyGroup>
          <BackLink to="/">홈으로 이동</BackLink>
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

const BackLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: theme.pxToRem(48),
  padding: `${theme.spacing.none} ${theme.spacing['2xl']}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.color.bg['brand-primary'],
  color: theme.color.text.inverse,
  textDecoration: 'none',
  ...theme.typography['body-m-sb'],

  '&:focus-visible': {
    outline: `${theme.pxToRem(2)} solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));
