import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import { RunnerTypeAvatar, Text } from '@/components';

import { PARTNER_EVENT_DISPLAY_LIMIT } from './constants';
import { PartnerEventItem } from './PartnerEventItem';
import type { MyActivityPartner } from './types';

type PartnerItemProps = {
  partner: MyActivityPartner;
};

export const PartnerItem = ({ partner }: PartnerItemProps): ReactElement => {
  const visibleEvents = partner.events.slice(0, PARTNER_EVENT_DISPLAY_LIMIT);
  const eventCountText =
    partner.eventCount > PARTNER_EVENT_DISPLAY_LIMIT
      ? `총 ${PARTNER_EVENT_DISPLAY_LIMIT}회 이상`
      : `총 ${partner.eventCount}회`;

  return (
    <PartnerListItem>
      <PartnerHeader>
        <PartnerIdentity>
          <RunnerTypeAvatar size="m" type={partner.type} />
          <PartnerName color="text.primary" font="body-m-sb">
            {partner.name}
          </PartnerName>
        </PartnerIdentity>
        <PartnerCount color="text.secondary" font="body-s-m">
          {eventCountText}
        </PartnerCount>
      </PartnerHeader>

      <PartnerTimeline>
        <TimelineRail aria-hidden={true}>
          <TimelineLine />
        </TimelineRail>
        <EventList aria-label={`${partner.name}님과 함께 달린 이벤트`}>
          {visibleEvents.map((event) => (
            <PartnerEventItem event={event} key={event.id} />
          ))}
        </EventList>
      </PartnerTimeline>
    </PartnerListItem>
  );
};

const PartnerListItem = styled.li(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const PartnerHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
  padding: `${theme.spacing.s} ${theme.spacing.none} ${theme.spacing.s} ${theme.spacing.s}`,
  borderRadius: theme.radius.full,
}));

const PartnerIdentity = styled.span(({ theme }) => ({
  display: 'inline-flex',
  flex: '0 1 auto',
  alignItems: 'center',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const PartnerName = styled(Text)({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const PartnerCount = styled(Text)({
  flex: '1 0 auto',
  textAlign: 'right',
});

const PartnerTimeline = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: theme.spacing.sm,
  width: '100%',
}));

const TimelineRail = styled.span(({ theme }) => ({
  display: 'flex',
  flex: `0 0 ${theme.pxToRem(30)}`,
  justifyContent: 'center',
}));

const TimelineLine = styled.span(({ theme }) => ({
  width: theme.pxToRem(5),
  minHeight: '100%',
  borderRadius: theme.radius.full,
  backgroundColor: theme.color.bg.overlay,
}));

const EventList = styled.ul(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  gap: theme.spacing.md,
  minWidth: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));
