import type { ReactElement } from 'react';

import type { EventDetailResponse } from '@/api/types';
import { FooterButton } from '@/components';

import { useEventDetailCta } from '../hooks/useEventDetailCta';

type EventDetailCtaProps = {
  canAccessProtectedTabs: boolean;
  canManageEvent: boolean;
  event: EventDetailResponse;
  onRestrictedAccess: () => void;
};

export const EventDetailCta = ({
  canAccessProtectedTabs,
  canManageEvent,
  event,
  onRestrictedAccess,
}: EventDetailCtaProps): ReactElement => {
  const { buttons, ratio } = useEventDetailCta({
    canAccessProtectedTabs,
    canManageEvent,
    event,
    onRestrictedAccess,
  });

  return (
    <FooterButton ratio={ratio}>
      {buttons.map(({ action, label, level, onClick, disabled }) => (
        <FooterButton.Button
          key={`${action}-${label}`}
          disabled={disabled}
          level={level}
          size="l"
          onClick={onClick}
        >
          {label}
        </FooterButton.Button>
      ))}
    </FooterButton>
  );
};
