import { useSuspenseQuery } from "@tanstack/react-query";

import { EVENT_LIST_TABS } from "@/api/constants/common";
import { api } from "@/api/services";
import type { EventListTypeFilter, RecruitStatusFilter } from "@/api/types";

import { eventListQueryKeys } from "../queryKeys";

type SearchEventsParams = {
  keyword: string;
  type: EventListTypeFilter;
  recruitStatus: RecruitStatusFilter;
  page: number;
};

export const useSearchEvents = (params: SearchEventsParams) => {
  const query = { tab: EVENT_LIST_TABS.UPCOMING, ...params };

  return useSuspenseQuery({
    queryKey: eventListQueryKeys.list(query),
    queryFn: () => api.event.searchGet(query),
  });
};
