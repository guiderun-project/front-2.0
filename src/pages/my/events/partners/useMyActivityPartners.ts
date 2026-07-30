import { useSuspenseQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import type { MyActivityPartnerSort } from '@/api/types';
import { toBackendPage } from '@/utils';

import { myActivityQueryKeys } from './queryKeys';

type UseMyActivityPartnersParams = {
  sort: MyActivityPartnerSort;
  page: number;
};

export const useMyActivityPartners = (params: UseMyActivityPartnersParams) =>
  useSuspenseQuery({
    queryKey: myActivityQueryKeys.partners(params),
    queryFn: () =>
      api.user.activityPartnersGet({
        ...params,
        page: toBackendPage(params.page),
      }),
  });
