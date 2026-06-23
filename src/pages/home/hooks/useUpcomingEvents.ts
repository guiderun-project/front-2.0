import { useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/api/services";
import { useAuth } from "@/contexts";

import { getHomeViewerKey, homeQueryKeys } from "@/pages/home/queryKeys";

export const useUpcomingEvents = () => {
  const { user } = useAuth();
  const viewerKey = getHomeViewerKey(user?.userId);

  return useSuspenseQuery({
    queryKey: homeQueryKeys.upcoming(viewerKey),
    queryFn: () => api.event.upcomingGet(),
  });
};
