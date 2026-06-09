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

/**
 * 다가오는 모임 패널의 한 행.
 * 이벤트 상세로 이동하는 Link이며, D-day는 색이 아닌 텍스트(뱃지)로 전달한다.
 */
export const UpcomingEventCard = ({
  event,
}: UpcomingEventCardProps): ReactElement => {
  const dateText = formatGuestEventDate(event.date);
  const ariaLabel = `${event.name}, ${formatDdayLabel(event.dDay)}, ${dateText}`;

  return (
    <RowItem>
      <RowLink aria-label={ariaLabel} to={APP_PATH.EVENT_DETAIL(event.id)}>
        <RowMain>
          <TitleLine>
            <Badge size="s" tone="cyan" variant="solid">
              {formatDday(event.dDay)}
            </Badge>
            <RowName color="text.primary" font="body-l-sb">
              {event.name}
            </RowName>
          </TitleLine>
          <Text color="text.secondary" font="detail-m-r">
            {dateText}
          </Text>
        </RowMain>
        <Icon
          aria-hidden={true}
          color="icon.teritary"
          icon="chevron-right-lined"
          size={20}
        />
      </RowLink>
    </RowItem>
  );
};

const RowItem = styled.li({
  listStyle: 'none',
});

const RowLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.xl,
  width: '100%',
  boxSizing: 'border-box',
  textDecoration: 'none',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const RowMain = styled.div(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const TitleLine = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minWidth: 0,
}));

const RowName = styled(Text)({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
