import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';

import { runningRecordQueryKeys } from '../queryKeys';

export const useMissingRunningDistance = () => {
  const { isAuthReady, user } = useAuth();

  return useQuery({
    queryKey: runningRecordQueryKeys.missing(),
    queryFn: () => api.event.missingRunningDistanceGet(),
    enabled: isAuthReady && user !== null && user.birthDate !== null,
  });
};
