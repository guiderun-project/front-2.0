import type { ReactElement } from 'react';

import type { EventDetailResponse } from '@/api/types';
import { FooterButton } from '@/components';

import { useEventDetailCta } from '../hooks/useEventDetailCta';

type EventDetailCtaProps = {
  canAccessProtectedTabs: boolean;
  event: EventDetailResponse;
  isApplyPermissionChecking?: boolean;
  isEventOrganizer: boolean;
  onApply?: () => void;
  onRestrictedAccess: () => void;
};

export const EventDetailCta = ({
  canAccessProtectedTabs,
  event,
  isApplyPermissionChecking,
  isEventOrganizer,
  onApply,
  onRestrictedAccess,
}: EventDetailCtaProps): ReactElement => {
  const { ctaItems, ratio } = useEventDetailCta({
    canAccessProtectedTabs,
    event,
    isApplyPermissionChecking,
    isEventOrganizer,
    onApply,
    onRestrictedAccess,
  });

  return (
    <FooterButton background="subtle" ratio={ratio}>
      {ctaItems.map((item) =>
        item.action === 'notice' ? (
          <FooterButton.Notice key={`${item.action}-${item.label}`}>
            {item.label}
          </FooterButton.Notice>
        ) : (
          <FooterButton.Button
            key={`${item.action}-${item.label}`}
            disabled={item.disabled}
            level={item.level}
            size="l"
            onClick={item.onClick}
          >
            {item.label}
          </FooterButton.Button>
        ),
      )}
    </FooterButton>
  );
};
