import type { ReactElement } from 'react';

import { useQuery } from '@tanstack/react-query';

import { userQueryKeys } from '@/api/queryKeys';
import { api } from '@/api/services';
import { useAuth } from '@/contexts';

export const UserPermissionBootstrap = (): ReactElement | null => {
  const { isAuthReady, user } = useAuth();

  useQuery({
    queryKey: user ? userQueryKeys.permission(user.userId) : userQueryKeys.root,
    queryFn: () => api.user.permissionGet(),
    enabled: isAuthReady && user !== null,
    retry: false,
    staleTime: Infinity,
  });

  return null;
};
