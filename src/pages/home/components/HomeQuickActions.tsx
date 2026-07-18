import type { ReactElement } from 'react';

import { css, type Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Text } from '@/components';
import { APP_PATH } from '@/router/path';

type ActionTone = 'teal' | 'cyan';

export const HomeQuickActions = (): ReactElement => {
  return (
    <Section>
      <ActionLink $tone="cyan" to={APP_PATH.MY_EVENTS}>
        <ActionLabel>
          <Text color="text.primary" font="body-l-sb">
            나의 활동 보기
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            활동 기록 모아보기
          </Text>
        </ActionLabel>
      </ActionLink>

      <ActionLink $tone="teal" to={APP_PATH.EVENT_NEW}>
        <ActionLabel>
          <Text color="text.primary" font="body-l-sb">
            모임 만들기
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            러닝 모임 만들어보기
          </Text>
        </ActionLabel>
      </ActionLink>
    </Section>
  );
};

const Section = styled.section(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing.md,
  width: '100%',
}));

const toneBackground = (theme: Theme, tone: ActionTone) =>
  tone === 'teal' ? theme.color.bg.accent1 : theme.color.bg.accent2;

const ActionLink = styled(Link, {
  shouldForwardProp: (propName) => propName !== '$tone',
})<{ $tone: ActionTone }>(
  ({ $tone, theme }) => css`
    display: flex;
    padding: ${theme.spacing.xl};
    border-radius: ${theme.radius.lg};
    background: ${toneBackground(theme, $tone)};
    text-align: left;
    text-decoration: none;

    &:focus-visible {
      outline: 2px solid ${theme.color.border.focused};
      outline-offset: ${theme.spacing.xs};
    }
  `,
);

const ActionLabel = styled.span(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.s,
  minWidth: 0,
}));
