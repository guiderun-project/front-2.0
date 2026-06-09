import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Badge, Icon, Text } from '@/components';
import { APP_PATH } from '@/router/path';

import {
  formatDday,
  formatDdayLabel,
  formatGuestEventDate,
  type UpcomingGuestEvent,
} from '../utils';

type UpcomingEventCardProps = {
  event: UpcomingGuestEvent;
};

export const UpcomingEventCard = ({
  event,
}: UpcomingEventCardProps): ReactElement => {
  const dateText = formatGuestEventDate(event.date);
  const ariaLabel = `${event.name}, ${formatDdayLabel(event.dDay)}, ${dateText}`;

  return (
    <CardItem>
      <CardLink aria-label={ariaLabel} to={APP_PATH.EVENT_DETAIL(event.id)}>
        <Badge size="s" tone="cyan" variant="solid">
          {formatDday(event.dDay)}
        </Badge>
        <CardBody>
          <CardName color="text.primary" font="body-m-sb">
            {event.name}
          </CardName>
          <Text color="text.tertiary" font="detail-m-m">
            {dateText}
          </Text>
        </CardBody>
        <Icon
          aria-hidden={true}
          color="icon.secondary"
          icon="chevron-right-lined"
          size={20}
        />
      </CardLink>
    </CardItem>
  );
};

const CardItem = styled.li({
  listStyle: 'none',
});

const CardLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
  padding: theme.spacing.lg,
  borderRadius: theme.radius.md,
  backgroundColor: theme.color.bg.default,
  boxSizing: 'border-box',
  textDecoration: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const CardBody = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  minWidth: 0,
}));

const CardName = styled(Text)({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
