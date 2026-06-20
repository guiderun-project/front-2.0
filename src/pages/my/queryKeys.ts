export const myQueryKeys = {
  root: ['my'] as const,
  myPage: (userId?: string) => [...myQueryKeys.root, 'mypage', userId] as const,
};
