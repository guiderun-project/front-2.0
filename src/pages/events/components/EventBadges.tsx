import type { ReactElement } from 'react';

import type { EventType, RecruitStatus } from '@/api/types';
import { Badge } from '@/components';
import type { BadgeSize } from '@/components';

import {
  getEventTypeBadgeConfig,
  getRecruitStatusBadgeConfig,
  type EventBadgeConfig,
} from '../utils/eventBadge';

type EventTypeBadgeProps = {
  eventType: EventType;
  size?: BadgeSize;
};

type RecruitStatusBadgeProps = {
  recruitStatus: RecruitStatus;
  size?: BadgeSize;
};

export const EventTypeBadge = ({
  eventType,
  size = 'm',
}: EventTypeBadgeProps): ReactElement => {
  return <EventBadge config={getEventTypeBadgeConfig(eventType)} size={size} />;
};

export const RecruitStatusBadge = ({
  recruitStatus,
  size = 'm',
}: RecruitStatusBadgeProps): ReactElement => {
  return (
    <EventBadge config={getRecruitStatusBadgeConfig(recruitStatus)} size={size} />
  );
};

const EventBadge = ({
  config,
  size,
}: {
  config: EventBadgeConfig;
  size: BadgeSize;
}): ReactElement => {
  if (config.variant === 'solid') {
    return (
      <Badge size={size} tone={config.tone} variant="solid">
        {config.label}
      </Badge>
    );
  }

  return (
    <Badge size={size} tone={config.tone} variant="soft">
      {config.label}
    </Badge>
  );
};
