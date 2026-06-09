export const HOME_GUEST_VIEWER_KEY = 'guest';

/**
 * 회원/비회원 응답이 캐시에서 섞이지 않도록 viewer 단위로 분리한다.
 * 로그인 시 userId, 비로그인 시 'guest'를 사용한다.
 */
export const getHomeViewerKey = (userId?: string | null) =>
  userId ?? HOME_GUEST_VIEWER_KEY;

export const homeQueryKeys = {
  root: ['home'] as const,
  summary: (viewerKey: string) =>
    [...homeQueryKeys.root, 'summary', viewerKey] as const,
  upcoming: (viewerKey: string) =>
    [...homeQueryKeys.root, 'upcoming', viewerKey] as const,
};
