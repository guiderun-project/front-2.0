import { useState, type ReactElement } from 'react';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';

import { MISSING_RUNNING_DISTANCE_QUERY_KEY } from './queryKeys';
import { RunningRecordSheet } from './RunningRecordSheet';
import {
  dismissEventId,
  getDismissedEventIds,
} from './runningRecordStorage';

export const RunningRecordGate = (): ReactElement | null => {
  const { isAuthReady, user } = useAuth();
  const [dismissedIds, setDismissedIds] = useState(getDismissedEventIds);

  const { data } = useQuery({
    queryKey: MISSING_RUNNING_DISTANCE_QUERY_KEY,
    queryFn: () => api.event.missingRunningDistanceGet(),
    enabled: isAuthReady && user !== null && user.birthDate !== null,
  });

  const target = data?.items.find((item) => !dismissedIds.has(item.eventId));

  if (!target) {
    return null;
  }

  const handleDismiss = () => {
    dismissEventId(target.eventId);
    setDismissedIds((prev) => new Set(prev).add(target.eventId));
  };

  return (
    <RunningRecordSheet
      eventId={target.eventId}
      eventName={target.name}
      onDismiss={handleDismiss}
    />
  );
};
