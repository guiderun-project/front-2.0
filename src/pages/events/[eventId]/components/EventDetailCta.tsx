import type { ReactElement } from 'react';

import type { EventDetailResponse } from '@/api/types';
import { ButtonGroup, FixedBottomCta } from '@/components';

import { useEventDetailCta } from '../useEventDetailCta';

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
    <FixedBottomCta>
      <ButtonGroup ratio={ratio}>
        {buttons.map(({ action, label, level, onClick, disabled }) => (
          <ButtonGroup.Button
            key={`${action}-${label}`}
            disabled={disabled}
            level={level}
            size="l"
            onClick={onClick}
          >
            {label}
          </ButtonGroup.Button>
        ))}
      </ButtonGroup>
    </FixedBottomCta>
  );
};
