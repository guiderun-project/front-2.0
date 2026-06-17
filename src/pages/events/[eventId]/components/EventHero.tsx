import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { EventDetailResponse } from '@/api/types';
import { Badge, Icon, Text } from '@/components';

import { EventTypeBadge, RecruitStatusBadge } from '../../components/EventBadges';

type EventHeroProps = {
  event: EventDetailResponse;
};

export const EventHero = ({ event }: EventHeroProps): ReactElement => {
  return (
    <HeroSection>
      <BadgeGroup>
        <EventTypeBadge eventType={event.eventType} />
        <RecruitStatusBadge recruitStatus={event.recruitStatus} />
        {event.isPrivate ? (
          <Badge size="m" tone="gray">
            비공개
            <Icon
              aria-hidden={true}
              color="badge.text.gray"
              icon="lock-lined"
              size={14}
            />
          </Badge>
        ) : null}
      </BadgeGroup>
      <HeroTitle as="h1" font="heading-m-b">
        {event.name}
      </HeroTitle>
    </HeroSection>
  );
};

const HeroSection = styled.header(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.lg,
  width: '100%',
  padding: `${theme.spacing.none} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`,
  boxSizing: 'border-box',
}));

const BadgeGroup = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.s,
}));

const HeroTitle = styled(Text)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.pxToRem(300),
  color: theme.color.text.primary,
  textAlign: 'center',
  whiteSpace: 'pre-wrap',
  wordBreak: 'keep-all',
}));
