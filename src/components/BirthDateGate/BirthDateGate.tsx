import type { ReactElement } from 'react';

import { useAuth } from '@/contexts';

import { BirthDateSheet } from './BirthDateSheet';

/**
 * 로그인된 기존 회원의 생년월일이 비어 있으면(null) 어느 페이지에서든
 * 생년월일 보충 시트를 강제로 노출하는 전역 게이트.
 */
export const BirthDateGate = (): ReactElement | null => {
  const { isAuthReady, user } = useAuth();

  if (!isAuthReady || user === null || user.birthDate !== null) {
    return null;
  }

  return <BirthDateSheet userName={user.name} />;
};
