import type { ReactElement } from 'react';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';

import { MISSING_RUNNING_DISTANCE_QUERY_KEY } from './queryKeys';
import { RunningRecordSheet } from './RunningRecordSheet';

export const RunningRecordGate = (): ReactElement | null => {
  const { isAuthReady, user } = useAuth();

  const { data } = useQuery({
    queryKey: MISSING_RUNNING_DISTANCE_QUERY_KEY,
    queryFn: () => api.event.missingRunningDistanceGet(),
    enabled: isAuthReady && user !== null && user.birthDate !== null,
  });

  const target = data?.items[0];

  if (!target) {
    return null;
  }

  return (
    <RunningRecordSheet eventId={target.eventId} eventName={target.name} />
  );
};
