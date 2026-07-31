import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { isBirthDateISO } from '@/utils';

import { runningRecordQueryKeys } from '../queryKeys';

export const useMissingRunningDistance = () => {
  const { isAuthReady, user } = useAuth();

  return useQuery({
    queryKey: runningRecordQueryKeys.missing(),
    queryFn: () => api.event.missingRunningDistanceGet(),
    // 생년월일 시트가 먼저 떠야 하므로 BirthDateGate 와 동일한 조건으로 막는다.
    enabled: isAuthReady && user !== null && isBirthDateISO(user.birthDate),
  });
};
