export const HOME_GUEST_VIEWER_KEY = 'guest';

export const getHomeViewerKey = (userId?: string | null) =>
  userId ?? HOME_GUEST_VIEWER_KEY;

export const homeQueryKeys = {
  root: ['home'] as const,
  summary: (viewerKey: string) =>
    [...homeQueryKeys.root, 'summary', viewerKey] as const,
  upcoming: (viewerKey: string) =>
    [...homeQueryKeys.root, 'upcoming', viewerKey] as const,
};
