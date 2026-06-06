import type { ReactElement } from 'react';

import styled from '@emotion/styled';

import type { EventDetailResponse } from '@/api/types';
import { Badge, Text } from '@/components';

import { getEventTypeLabel, getRecruitStatusLabel } from '../utils';

type EventHeroProps = {
  event: EventDetailResponse;
};

export const EventHero = ({ event }: EventHeroProps): ReactElement => {
  return (
    <HeroSection>
      <BadgeGroup>
        <Badge size="m" tone="gray" variant="solid">
          {getEventTypeLabel(event.eventType)}
        </Badge>
        <Badge size="m" tone="cyan2">
          {getRecruitStatusLabel(event.recruitStatus)}
        </Badge>
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
  gap: theme.spacing.md,
}));

const HeroTitle = styled(Text)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.pxToRem(300),
  color: theme.color.text.primary,
  textAlign: 'center',
  whiteSpace: 'pre-wrap',
  wordBreak: 'keep-all',
}));
