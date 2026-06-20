import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

// TODO: API 연동 시 props로 대체
const PROFILE = {
  initial: 'V',
  name: '가나다',
  meta: '여성・가이드러너・B그룹',
} as const;

export const ProfileSummary = (): ReactElement => {
  return (
    <Container>
      <Avatar aria-hidden={true}>{PROFILE.initial}</Avatar>
      <NameGroup>
        <Text as="h2" align="center" color="text.primary" font="heading-m-b">
          {PROFILE.name}
        </Text>
        <Text align="center" color="text.tertiary" font="body-m-m">
          {PROFILE.meta}
        </Text>
      </NameGroup>
    </Container>
  );
};

const Container = styled.section(({ theme }) => ({
  display: 'flex',
  padding: `0 ${theme.spacing['4xl']} ${theme.spacing['2xl']}`,
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
}));

const Avatar = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: theme.pxToRem(72),
  height: theme.pxToRem(72),
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.profile.vi,
  color: theme.color.text.inverse,
  fontSize: theme.pxToRem(40),
  fontWeight: theme.fontWeight.semibold,
  lineHeight: 1,
}));

const NameGroup = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.md,
  width: '100%',
}));
