import type { MyActivityPartnerSort } from '@/api/types';

type MyActivityPartnersQueryParams = {
  sort: MyActivityPartnerSort;
  page: number;
};

export const myActivityQueryKeys = {
  root: ['my-activity'] as const,
  partners: (params: MyActivityPartnersQueryParams) =>
    [...myActivityQueryKeys.root, 'partners', params] as const,
};
