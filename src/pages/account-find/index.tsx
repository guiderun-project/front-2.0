import type { ReactElement } from 'react';

import { useSearchParams } from 'react-router-dom';

import { ACCOUNT_FIND_TYPE, type AccountFindType } from '@/constants';

import { FindId } from './FindId';
import { FindPassword } from './FindPassword';

const resolveType = (value: string | null): AccountFindType =>
  value === ACCOUNT_FIND_TYPE.PASSWORD
    ? ACCOUNT_FIND_TYPE.PASSWORD
    : ACCOUNT_FIND_TYPE.ID;

export const AccountFindPage = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const type = resolveType(searchParams.get('type'));

  return type === ACCOUNT_FIND_TYPE.PASSWORD ? <FindPassword /> : <FindId />;
};
