import { createContext, useContext } from 'react';

import type { EventDetailResponse } from '@/api/types';

export type EventDetailRouteContextValue = {
  event: EventDetailResponse;
  eventId: number;
  isValidEventId: boolean;
};

export const EventDetailRouteContext =
  createContext<EventDetailRouteContextValue | null>(null);

export const useEventDetailRoute = () => {
  const context = useContext(EventDetailRouteContext);

  if (!context) {
    throw new Error(
      'useEventDetailRoute must be used within EventDetailRouteProvider.',
    );
  }

  return context;
};
