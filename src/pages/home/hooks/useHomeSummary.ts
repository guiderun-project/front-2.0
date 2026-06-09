import { useSuspenseQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';

import { getHomeViewerKey, homeQueryKeys } from '../queryKeys';

export const useHomeSummary = () => {
  const { user } = useAuth();
  const viewerKey = getHomeViewerKey(user?.userId);

  return useSuspenseQuery({
    queryKey: homeQueryKeys.summary(viewerKey),
    queryFn: () => api.event.summaryGet(),
  });
};
