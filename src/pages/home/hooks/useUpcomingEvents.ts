import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';

import { getHomeViewerKey, homeQueryKeys } from '../queryKeys';

/**
 * 다가오는 모임을 조회한다.
 * 비로그인은 시작이 임박한 공개 모임(GUEST), 로그인은 내가 참여한 모임(MEMBER)을 받는다.
 * 응답 형태가 viewer에 따라 달라지므로 viewer 키로 캐시를 분리하고,
 * 인증 판별이 끝난(isAuthReady) 뒤에 호출한다.
 *
 * @see https://www.notion.so/35d9802df49681b893efce4acc4f02ea
 */
export const useUpcomingEvents = () => {
  const { isAuthReady, user } = useAuth();
  const viewerKey = getHomeViewerKey(user?.userId);

  return useQuery({
    queryKey: homeQueryKeys.upcoming(viewerKey),
    queryFn: () => api.event.upcomingGet(),
    enabled: isAuthReady,
  });
};
