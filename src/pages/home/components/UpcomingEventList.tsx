import { Fragment, useId, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

import { useUpcomingEvents } from '../hooks/useUpcomingEvents';
import { HomeSectionMessage } from './HomeSectionMessage';
import { UpcomingEventCard } from './UpcomingEventCard';

/**
 * 다가오는 러닝 모임(비로그인) 섹션.
 * GUEST 응답(시작 임박 공개 모임, 최대 5개)을 그림자 패널 안의 행 + 구분선으로 노출한다.
 * 로딩/에러는 상위 Suspense + ErrorBoundary에서 처리한다.
 * 회원(MEMBER) 응답 카드는 회원 단계에서 별도 구현한다.
 */
export const UpcomingEventList = (): ReactElement => {
  const headingId = useId();
  const { data } = useUpcomingEvents();
  const guestItems = data.viewerType === 'GUEST' ? data.items : [];

  return (
    <Section aria-labelledby={headingId}>
      <Text id={headingId} as="h2" color="text.primary" font="heading-s-sb">
        다가오는 러닝 모임
      </Text>

      {guestItems.length > 0 ? (
        <Panel>
          {guestItems.map((event, index) => (
            <Fragment key={event.id}>
              {index > 0 ? <RowDivider aria-hidden={true} /> : null}
              <UpcomingEventCard event={event} />
            </Fragment>
          ))}
        </Panel>
      ) : (
        <HomeSectionMessage>아직 다가오는 모임이 없어요.</HomeSectionMessage>
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

const Panel = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xl,
  margin: 0,
  padding: theme.spacing.xl,
  listStyle: 'none',
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.elevated,
  boxShadow: `0 ${theme.pxToRem(4)} ${theme.pxToRem(12)} ${theme.color.bg.overlay}`,
}));

const RowDivider = styled.li(({ theme }) => ({
  height: theme.pxToRem(1),
  backgroundColor: theme.color.border.subtle,
  listStyle: 'none',
}));
