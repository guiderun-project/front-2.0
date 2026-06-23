import { Suspense, useMemo, type ReactElement } from 'react';

import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, useParams } from 'react-router-dom';

import { api } from '@/api/services';
import type { EventDetailResponse } from '@/api/types';
import { ErrorBoundary, LoaderScreen } from '@/components';
import { PageLayout } from '@/components/PageLayout';
import { useAuth } from '@/contexts';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';

import {
  EventDetailRouteContext,
  type EventDetailRouteContextValue,
} from './EventDetailRouteContext';
import { eventDetailQueryKeys, getEventDetailViewerKey } from './queryKeys';

type EventDetailRouteStateProps = {
  description: string;
  title: string;
};

type EventDetailRouteContentProps = {
  eventId: number;
  viewerKey: string;
};

const EventDetailRouteState = ({
  description,
  title,
}: EventDetailRouteStateProps): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <RoutePlaceholder title={title} description={description} />
    </PageLayout>
  );
};

const EventDetailRouteLoader = (): ReactElement => {
  return (
    <PageLayout background="bg.brand-event" gradient="gradient.bg.brand-event">
      <LoaderScreen label="이벤트 정보를 불러오는 중이에요." />
    </PageLayout>
  );
};

const EventDetailRouteContent = ({
  eventId,
  viewerKey,
}: EventDetailRouteContentProps): ReactElement => {
  const { data: event } = useSuspenseQuery<EventDetailResponse>({
    queryKey: eventDetailQueryKeys.detail(eventId, viewerKey),
    queryFn: () => api.event.detailGet({ eventId }),
  });
  const value = useMemo<EventDetailRouteContextValue>(
    () => ({
      event,
      eventId,
      isValidEventId: true,
    }),
    [event, eventId],
  );

  return (
    <EventDetailRouteContext.Provider value={value}>
      <Outlet />
    </EventDetailRouteContext.Provider>
  );
};

export const EventDetailRouteProvider = (): ReactElement => {
  const { eventId: eventIdParam } = useParams();
  const { isAuthReady, user } = useAuth();
  const eventId = Number(eventIdParam);
  const isValidEventId = Number.isInteger(eventId) && eventId > 0;
  const viewerKey = getEventDetailViewerKey(user?.userId);

  if (!isValidEventId) {
    return (
      <EventDetailRouteState
        title="잘못된 이벤트 주소예요"
        description="이벤트 주소를 다시 확인해주세요."
      />
    );
  }

  if (!isAuthReady) {
    return <EventDetailRouteLoader />;
  }

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          key={eventId}
          fallback={
            <EventDetailRouteState
              title="이벤트 정보를 불러오지 못했어요"
              description="잠시 후 다시 시도해주세요."
            />
          }
          onReset={reset}
        >
          <Suspense fallback={<EventDetailRouteLoader />}>
            <EventDetailRouteContent eventId={eventId} viewerKey={viewerKey} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
