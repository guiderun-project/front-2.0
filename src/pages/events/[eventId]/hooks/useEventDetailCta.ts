import { useMemo } from 'react';

import type { EventDetailResponse } from '@/api/types';
import type { ButtonGroupRatio } from '@/components';

import { useEventDetailCtaActionProps } from './useEventDetailCtaActionProps';
import {
  getEventDetailCtaButtonConfigs,
  type EventDetailCtaButtonConfig,
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

type UseEventDetailCtaResult = {
  buttons: EventDetailCtaButton[];
  ratio?: ButtonGroupRatio;
};

export const useEventDetailCta = ({
  canAccessProtectedTabs,
  canManageEvent,
  event,
  onRestrictedAccess,
}: UseEventDetailCtaParams): UseEventDetailCtaResult => {
  const eventId = event.eventId;
  const { getEventDetailCtaActionProps } = useEventDetailCtaActionProps({
    canAccessProtectedTabs,
    eventId,
    onRestrictedAccess,
  });

  const buttonConfigs = useMemo(
    () =>
      getEventDetailCtaButtonConfigs({
        canManageEvent,
        isApplied: event.viewer?.isApplied === true,
        recruitStatus: event.recruitStatus,
      }),
    [canManageEvent, event.recruitStatus, event.viewer?.isApplied],
  );

  const buttons = buttonConfigs.map<EventDetailCtaButton>((button) => ({
    ...button,
    ...getEventDetailCtaActionProps(button),
  }));

  return {
    buttons,
    ratio: buttons.length === 2 ? '35:65' : undefined,
  };
};
