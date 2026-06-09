import type { ReactElement } from 'react';

import { css, type Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Text } from '@/components';
import { APP_PATH } from '@/router/path';

type ActionTone = 'teal' | 'cyan';

export const HomeQuickActions = (): ReactElement => {
  return (
    <Section aria-label="회원 활동 바로가기">
      <ActionLink $tone="teal" to={APP_PATH.MY_EVENTS}>
        <ActionLabel>
          <Text color="text.primary" font="body-l-sb">
            나의 활동 보기
          </Text>
          <Text color="text.tertiary" font="detail-m-r">
            활동 기록 모아보기
          </Text>
        </ActionLabel>
      </ActionLink>

      <ActionLink $tone="cyan" to={APP_PATH.EVENT_NEW}>
        <ActionLabel>
          <Text color="text.primary" font="body-l-sb">
            이벤트 만들기
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

// soft 틴트 배경은 대응 시맨틱 토큰이 없어 프리미티브를 직접 사용한다.
const toneBackground = (theme: Theme, tone: ActionTone) =>
  tone === 'teal'
    ? theme.colorPrimitive.accent.teal.a16
    : theme.colorPrimitive.cyan['400-a12'];

const ActionLink = styled(Link)<{ $tone: ActionTone }>(
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
