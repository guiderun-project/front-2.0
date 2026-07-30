export const ACCOUNT_FIND_TYPE = {
  ID: 'id',
  PASSWORD: 'password',
} as const;

export type AccountFindType =
  (typeof ACCOUNT_FIND_TYPE)[keyof typeof ACCOUNT_FIND_TYPE];
