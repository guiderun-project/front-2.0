import type { ReactElement } from 'react';

import { useAuth } from '@/contexts';

import { BirthDateSheet } from './BirthDateSheet';

export const BirthDateGate = (): ReactElement | null => {
  const { isAuthReady, user } = useAuth();

  if (!isAuthReady || user === null || user.birthDate !== null) {
    return null;
  }

  return <BirthDateSheet userName={user.name} />;
};
