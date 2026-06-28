import { useEffect, useMemo, useState } from 'react';

import type { EventDetailResponse } from '@/api/types';
import type { ButtonGroupRatio } from '@/components';

import { useEventDetailCtaActionProps } from './useEventDetailCtaActionProps';
import {
  getEventDateStartTimestamp,
  getEventDetailCtaButtonConfigs,
  hasEventDateStarted,
  type EventDetailCtaButtonConfig,
  type EventDetailCtaConfig,
  type EventDetailCtaNoticeConfig,
} from '../utils/eventDetailCtaButtonConfigs';

type UseEventDetailCtaParams = {
  canAccessProtectedTabs: boolean;
  canManageEvent: boolean;
  event: EventDetailResponse;
  onRestrictedAccess: () => void;
};

type EventDetailCtaButton = EventDetailCtaButtonConfig & {
  onClick?: () => void;
};

type EventDetailCtaNotice = EventDetailCtaNoticeConfig;

type EventDetailCtaItem = EventDetailCtaButton | EventDetailCtaNotice;

type UseEventDetailCtaResult = {
  ctaItems: EventDetailCtaItem[];
  ratio?: ButtonGroupRatio;
};

const MAX_TIMEOUT_DELAY_MS = 2_147_483_647;

const isEventDetailCtaButtonConfig = (
  config: EventDetailCtaConfig,
): config is EventDetailCtaButtonConfig => config.action !== 'notice';

export const useEventDetailCta = ({
  canAccessProtectedTabs,
  canManageEvent,
  event,
  onRestrictedAccess,
}: UseEventDetailCtaParams): UseEventDetailCtaResult => {
  const eventId = event.eventId;
  const eventDate = event.schedule.date;
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const { getEventDetailCtaActionProps } = useEventDetailCtaActionProps({
    canAccessProtectedTabs,
    eventId,
    onRestrictedAccess,
  });
  const isEventDateStarted = hasEventDateStarted(eventDate, currentTime);

  useEffect(() => {
    const eventDateStartTimestamp = getEventDateStartTimestamp(eventDate);

    if (
      eventDateStartTimestamp === null ||
      currentTime >= eventDateStartTimestamp
    ) {
      return;
    }

    const delay = Math.min(
      eventDateStartTimestamp - currentTime,
      MAX_TIMEOUT_DELAY_MS,
    );
    const timeoutId = window.setTimeout(() => {
      setCurrentTime(Date.now());
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentTime, eventDate]);

  const buttonConfigs = useMemo(
    () =>
      getEventDetailCtaButtonConfigs({
        canManageEvent,
        isEventDateStarted,
        isApplied: event.viewer?.isApplied === true,
        recruitStatus: event.recruitStatus,
      }),
    [
      canManageEvent,
      event.recruitStatus,
      event.viewer?.isApplied,
      isEventDateStarted,
    ],
  );

  const ctaItems = buttonConfigs.map<EventDetailCtaItem>((config) => {
    if (!isEventDetailCtaButtonConfig(config)) {
      return config;
    }

    return {
      ...config,
      ...getEventDetailCtaActionProps(config),
    };
  });

  const buttonCount = ctaItems.filter(isEventDetailCtaButtonConfig).length;

  return {
    ctaItems,
    ratio: buttonCount === 2 ? '35:65' : undefined,
  };
};
