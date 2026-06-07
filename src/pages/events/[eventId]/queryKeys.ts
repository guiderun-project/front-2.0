export const EVENT_DETAIL_GUEST_VIEWER_KEY = 'guest';

export const getEventDetailViewerKey = (userId?: string | null) => {
  return userId ?? EVENT_DETAIL_GUEST_VIEWER_KEY;
};

export const eventDetailQueryKeys = {
  root: ['event'] as const,
  detailRoot: (eventId: number) =>
    [...eventDetailQueryKeys.root, 'detail', eventId] as const,
  detail: (eventId: number, viewerKey: string) =>
    [...eventDetailQueryKeys.detailRoot(eventId), viewerKey] as const,
  applicants: (eventId: number) =>
    [...eventDetailQueryKeys.root, 'applicants', eventId] as const,
  applicantForm: (eventId: number, userId: string) =>
    [...eventDetailQueryKeys.applicants(eventId), 'form', userId] as const,
  matchingStatus: (eventId: number) =>
    [...eventDetailQueryKeys.root, 'matching', 'status', eventId] as const,
  comments: (eventId: number) =>
    [...eventDetailQueryKeys.root, 'comments', eventId] as const,
};
