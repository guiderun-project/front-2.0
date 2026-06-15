export const attendanceQueryKeys = {
  root: ['event', 'attendance'] as const,
  status: (eventId: number) =>
    [...attendanceQueryKeys.root, 'status', eventId] as const,
  canceledApplicants: (eventId: number) =>
    [...attendanceQueryKeys.root, 'canceled-applicants', eventId] as const,
};
