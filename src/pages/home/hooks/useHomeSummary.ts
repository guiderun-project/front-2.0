import { useSuspenseQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';

import { getHomeViewerKey, homeQueryKeys } from '../queryKeys';

/**
 * 메인 활동 요약을 조회한다.
 * 비로그인은 publicSummary만, 로그인은 mySummary까지 함께 내려온다.
 * guest/회원 응답이 섞이지 않도록 viewer 키로 캐시를 분리한다.
 * 로딩/에러는 상위 Suspense + ErrorBoundary에서 처리하므로,
 * 인증 판별이 끝난(isAuthReady) 뒤에 해당 경계를 마운트해야 한다.
 *
 * @see https://www.notion.so/35d9802df4968111a2dacb358e745142
 */
export const useHomeSummary = () => {
  const { user } = useAuth();
  const viewerKey = getHomeViewerKey(user?.userId);

  return useSuspenseQuery({
    queryKey: homeQueryKeys.summary(viewerKey),
    queryFn: () => api.event.summaryGet(),
  });
};
