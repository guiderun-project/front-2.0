export const matchQueryKeys = {
  root: ['event', 'match'] as const,
  waiting: (eventId: number) =>
    [...matchQueryKeys.root, 'waiting', eventId] as const,
  completed: (eventId: number) =>
    [...matchQueryKeys.root, 'completed', eventId] as const,
};
