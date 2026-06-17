import type {
  EventListTab,
  EventListTypeFilter,
  RecruitStatusFilter,
} from "@/api/types";

type EventListQueryParams = {
  tab: EventListTab;
  type: EventListTypeFilter;
  recruitStatus: RecruitStatusFilter;
  keyword: string;
  page: number;
};

export const eventListQueryKeys = {
  root: ["event-list"] as const,
  list: (params: EventListQueryParams) =>
    [...eventListQueryKeys.root, params] as const,
};
