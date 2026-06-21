import { useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@/api/services";
import type {
  EventListTab,
  EventListTypeFilter,
  RecruitStatusFilter,
} from "@/api/types";

import { eventListQueryKeys } from "../queryKeys";

type BrowseEventsParams = {
  tab: EventListTab;
  type: EventListTypeFilter;
  recruitStatus: RecruitStatusFilter;
  page: number;
};

export const useBrowseEvents = (params: BrowseEventsParams) =>
  useSuspenseQuery({
    queryKey: eventListQueryKeys.list({ ...params, keyword: "" }),
    queryFn: () => api.event.allGet(params),
  });
