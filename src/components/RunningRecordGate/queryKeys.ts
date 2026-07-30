export const runningRecordQueryKeys = {
  root: ['running-record'] as const,
  missing: () => [...runningRecordQueryKeys.root, 'missing'] as const,
};
