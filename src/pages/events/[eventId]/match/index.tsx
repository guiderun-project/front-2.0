import type { ReactElement } from 'react';

import { useAuth } from '@/contexts';

import type { MatchMessageState } from './matchPageState';
import { MatchMessagePage } from './components/MatchMessagePage';
import { MatchPageBoundary } from './components/MatchPageBoundary';
import { MatchPermissionGate } from './components/MatchPermissionGate';
import { useEventMatchRoute } from './useEventMatchPage';

const EVENT_CHECKING_STATE: MatchMessageState = {
  message: '이벤트 정보를 가지고 오고 있어요',
  role: 'status',
};

const EVENT_ERROR_STATE: MatchMessageState = {
  message: '이벤트 정보를 가지고 오지 못했어요',
  role: 'alert',
};

const INVALID_EVENT_STATE: MatchMessageState = {
  message: '잘못된 이벤트 주소예요',
  role: 'alert',
};

export const EventMatchPage = (): ReactElement => {
  const { eventId } = useEventMatchRoute();
  const { isAuthReady } = useAuth();

  if (eventId === null) {
    return <MatchMessagePage pageState={INVALID_EVENT_STATE} />;
  }

  if (!isAuthReady) {
    return <MatchMessagePage pageState={EVENT_CHECKING_STATE} />;
  }

  return (
    <MatchPageBoundary
      errorState={EVENT_ERROR_STATE}
      loadingState={EVENT_CHECKING_STATE}
    >
      <MatchPermissionGate eventId={eventId} />
    </MatchPageBoundary>
  );
};
