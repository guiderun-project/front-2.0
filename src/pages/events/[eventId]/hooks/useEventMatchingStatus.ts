import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/services';

import { eventDetailQueryKeys } from '../queryKeys';
import {
  createMatchingStatusViewModel,
  type MatchingStatusViewModel,
} from './matchingStatusViewModel';

type UseEventMatchingStatusParams = {
  enabled: boolean;
  eventId: number;
};

type UseEventMatchingStatusResult = {
  data?: MatchingStatusViewModel;
  isEmpty: boolean;
  isError: boolean;
  isPending: boolean;
};

export const useEventMatchingStatus = ({
  enabled,
  eventId,
}: UseEventMatchingStatusParams): UseEventMatchingStatusResult => {
  const isValidEventId = Number.isInteger(eventId) && eventId > 0;
  const shouldFetch = enabled && isValidEventId;

  const matchingStatusQuery = useQuery({
    queryKey: eventDetailQueryKeys.matchingStatus(eventId),
    queryFn: () => api.matching.statusGet({ eventId }),
    enabled: shouldFetch,
  });

  const data = useMemo(
    () =>
      matchingStatusQuery.data
        ? createMatchingStatusViewModel(matchingStatusQuery.data)
        : undefined,
    [matchingStatusQuery.data],
  );

  return {
    data,
    isEmpty: data?.isEmpty ?? false,
    isError: matchingStatusQuery.isError,
    isPending: shouldFetch ? matchingStatusQuery.isPending : false,
  };
};
