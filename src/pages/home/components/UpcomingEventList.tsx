import { useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

import { useUpcomingEvents } from '../hooks/useUpcomingEvents';
import { UpcomingEventCard } from './UpcomingEventCard';

/**
 * 다가오는 러닝 모임(비로그인) 섹션.
 * GUEST 응답(시작 임박 공개 모임, 최대 5개)을 카드 리스트로 노출한다.
 * 회원(MEMBER) 응답 카드는 회원 단계에서 별도 구현한다.
 */
export const UpcomingEventList = (): ReactElement => {
  const headingId = useId();
  const { data, isError, isPending } = useUpcomingEvents();
  const guestItems = data?.viewerType === 'GUEST' ? data.items : [];

  return (
    <Section aria-busy={isPending} aria-labelledby={headingId}>
      <Text id={headingId} as="h2" color="text.primary" font="heading-s-sb">
        다가오는 러닝 모임
      </Text>

      {isPending ? (
        <StateText>다가오는 모임을 불러오는 중입니다.</StateText>
      ) : isError ? (
        <StateText>다가오는 모임을 불러오지 못했어요.</StateText>
      ) : guestItems.length > 0 ? (
        <List>
          {guestItems.map((event) => (
            <UpcomingEventCard key={event.id} event={event} />
          ))}
        </List>
      ) : (
        <StateText>아직 다가오는 모임이 없어요.</StateText>
      )}

      {/* TODO: 회원(MEMBER) 응답 카드(place/scheduleText/myPartner)는 회원 단계에서 구현 */}
    </Section>
  );
};

const Section = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
}));

const List = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  margin: 0,
  padding: 0,
}));

const StateText = styled.p(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  minHeight: theme.pxToRem(96),
  margin: 0,
  padding: theme.spacing.lg,
  color: theme.color.text.tertiary,
  fontFamily: theme.typography['body-m-m'].fontFamily,
  fontSize: theme.typography['body-m-m'].fontSize,
  fontWeight: theme.typography['body-m-m'].fontWeight,
  letterSpacing: theme.typography['body-m-m'].letterSpacing,
  lineHeight: theme.typography['body-m-m'].lineHeight,
  textAlign: 'center',
}));
