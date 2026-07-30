import { useSuspenseQuery } from '@tanstack/react-query';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { myQueryKeys } from '@/pages/my/queryKeys';

export const useMyPage = () => {
  const { user } = useAuth();

  return useSuspenseQuery({
    queryKey: myQueryKeys.myPage(user?.userId),
    queryFn: () => api.user.myPageGet(),
  });
};
