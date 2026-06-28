import { Suspense, useMemo, type ReactElement } from 'react';

import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import { api } from '@/api/services';
import type { EventDetailResponse } from '@/api/types';
import { ErrorBoundary, LoaderScreen } from '@/components';
import { PageLayout } from '@/components/PageLayout';
import { useAuth } from '@/contexts';
import { RoutePlaceholder } from '@/pages/_shared/RoutePlaceholder';
import { APP_PATH } from '@/router/path';
import { PageTitle } from '@/router/PageTitle';

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

const EVENT_DETAIL_DEFAULT_PAGE_TITLE = '모임 상세';

const getEventDetailPageTitle = (
  pathname: string,
  eventId: number,
  eventName: string,
): string => {
  if (pathname === APP_PATH.EVENT_APPLY(eventId)) {
    return `모임 신청 - ${eventName}`;
  }

  if (pathname === APP_PATH.EVENT_EDIT(eventId)) {
    return `모임 수정 - ${eventName}`;
  }

  if (pathname === APP_PATH.EVENT_MATCH(eventId)) {
    return `모임 매칭 - ${eventName}`;
  }

  if (pathname === APP_PATH.EVENT_ATTENDANCE(eventId)) {
    return `출석 관리 - ${eventName}`;
  }

  return eventName;
};

const EventDetailRouteState = ({
  description,
  title,
}: EventDetailRouteStateProps): ReactElement => {
  return (
    <PageLayout background="bg.subtle">
      <PageTitle title={EVENT_DETAIL_DEFAULT_PAGE_TITLE} />
      <RoutePlaceholder title={title} description={description} />
    </PageLayout>
  );
};

const EventDetailRouteLoader = (): ReactElement => {
  return (
    <PageLayout background="bg.brand-event" gradient="gradient.bg.brand-event">
      <PageTitle title={EVENT_DETAIL_DEFAULT_PAGE_TITLE} />
      <LoaderScreen label="이벤트 정보를 불러오는 중이에요." />
    </PageLayout>
  );
};

const EventDetailRouteContent = ({
  eventId,
  viewerKey,
}: EventDetailRouteContentProps): ReactElement => {
  const { pathname } = useLocation();
  const { data: event } = useSuspenseQuery<EventDetailResponse>({
    queryKey: eventDetailQueryKeys.detail(eventId, viewerKey),
    queryFn: () => api.event.detailGet({ eventId }),
  });
  const pageTitle = getEventDetailPageTitle(pathname, eventId, event.name);
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
      <PageTitle title={pageTitle} />
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
