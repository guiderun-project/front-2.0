import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import type { MyActivityEventsResponse } from '@/api/types';
import { Icon, Text } from '@/components';
import { APP_PATH } from '@/router/path';

type MyActivityEvent = MyActivityEventsResponse['items'][number];

const EVENT_TYPE_LABEL: Record<MyActivityEvent['type'], string> = {
  COMPETITION: '대회',
  TRAINING: '훈련',
};

type MyActivityEventCardProps = {
  event: MyActivityEvent;
};

export const MyActivityEventCard = ({
  event,
}: MyActivityEventCardProps): ReactElement => {
  return (
    <CardItem>
      <CardLink to={APP_PATH.EVENT_DETAIL(event.id)}>
        <CardBody>
          <CardName color="text.primary" font="body-l-sb">
            {event.name}
          </CardName>
          <Text color="text.tertiary" font="detail-m-r">
            {EVENT_TYPE_LABEL[event.type]} · {event.dateText}
          </Text>
        </CardBody>
        <Icon
          aria-hidden={true}
          color="icon.tertiary"
          icon="chevron-right-lined"
          size={20}
        />
      </CardLink>
    </CardItem>
  );
};

const CardItem = styled.li(({ theme }) => ({
  listStyle: 'none',

  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.color.border.subtle}`,
  },
}));

const CardLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.lg,
  padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
  textDecoration: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: `-${theme.spacing.xs}`,
  },
}));

const CardBody = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing.s,
  minWidth: 0,
}));

const CardName = styled(Text)({
  display: 'block',
  width: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
