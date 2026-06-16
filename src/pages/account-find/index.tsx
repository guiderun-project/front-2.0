import type { ReactElement } from 'react';

import { useSearchParams } from 'react-router-dom';

import { FindId } from './FindId';
import { FindPassword } from './FindPassword';

export type AccountFindType = 'id' | 'password';

const resolveType = (value: string | null): AccountFindType =>
  value === 'password' ? 'password' : 'id';

export const AccountFindPage = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const type = resolveType(searchParams.get('type'));

  return type === 'password' ? <FindPassword /> : <FindId />;
};
