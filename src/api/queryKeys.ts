export const userQueryKeys = {
  root: ['user'] as const,
  permission: (userId: string) =>
    [...userQueryKeys.root, 'permission', userId] as const,
};
