import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { api } from "@/api/services";

import { eventListQueryKeys, type EventListQueryParams } from "../queryKeys";

export const useEventList = (params: EventListQueryParams) => {
  const keyword = params.keyword.trim();
  const query = {
    tab: params.tab,
    type: params.type,
    recruitStatus: params.recruitStatus,
    page: params.page,
  };

  return useQuery({
    queryKey: eventListQueryKeys.list({ ...query, keyword }),
    queryFn: () =>
      keyword
        ? api.event.searchGet({ ...query, keyword })
        : api.event.allGet(query),
    placeholderData: keepPreviousData,
  });
};
