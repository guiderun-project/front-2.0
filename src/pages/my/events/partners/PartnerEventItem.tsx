import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Text } from '@/components';
import { APP_PATH } from '@/router/path';

import { formatActivityEventDate } from './formatActivityEventDate';
import type { MyActivityPartnerEvent } from './types';

type PartnerEventItemProps = {
  event: MyActivityPartnerEvent;
};

export const PartnerEventItem = ({
  event,
}: PartnerEventItemProps): ReactElement => {
  const eventDate = formatActivityEventDate(event.date);

  return (
    <EventListItem>
      <EventCard
        aria-label={`${event.name}, ${eventDate}`}
        to={APP_PATH.EVENT_DETAIL(event.id)}
      >
        <EventName color="text.primary" font="body-s-m">
          {event.name}
        </EventName>
        <EventDate color="text.secondary" font="body-s-r">
          {eventDate}
        </EventDate>
      </EventCard>
    </EventListItem>
  );
};

const EventListItem = styled.li({
  minWidth: 0,
});

const EventCard = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.spacing.s,
  width: '100%',
  boxSizing: 'border-box',
  minHeight: theme.pxToRem(70),
  padding: theme.spacing.lg,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.color.bg.elevated,
  textDecoration: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const EventName = styled(Text)({
  display: 'block',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const EventDate = styled(Text)({
  display: 'block',
});
