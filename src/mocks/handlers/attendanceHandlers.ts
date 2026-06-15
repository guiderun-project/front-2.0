import { http, HttpResponse, type HttpHandler } from 'msw';

import {
  getAppliedForms,
  getAttendanceSummary,
  getFormUser,
  mockDb,
} from '@/mocks/fixtures';
import { apiUrl, notFound } from '@/mocks/http';

const toAttendanceParticipant = (form: ReturnType<typeof getAppliedForms>[number]) => {
  const user = getFormUser(form);

  return {
    userId: user.userId,
    name: user.name,
    type: user.type,
    isFirstParticipation: user.firstParticipation,
  };
};

export const attendanceHandlers: HttpHandler[] = [
  http.get<{ eventId: string }>(
    apiUrl('/event/:eventId/attendance'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const forms = getAppliedForms(eventId);

      return HttpResponse.json({
        summary: getAttendanceSummary(eventId),
        waiting: forms
          .filter((form) => !form.attended)
          .map(toAttendanceParticipant),
        attended: forms
          .filter((form) => form.attended)
          .map(toAttendanceParticipant),
      });
    },
  ),

  http.post<{ eventId: string; userId: string }>(
    apiUrl('/event/:eventId/attendance/:userId'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const userId = String(params.userId);
      const form = mockDb.forms.find(
        (item) =>
          item.eventId === eventId &&
          item.userId === userId &&
          item.status === 'APPLIED',
      );

      if (!form) {
        return notFound('Application form not found.');
      }

      form.attended = true;

      return HttpResponse.json({
        userId,
        isAttended: true,
        summary: getAttendanceSummary(eventId),
      });
    },
  ),

  http.delete<{ eventId: string; userId: string }>(
    apiUrl('/event/:eventId/attendance/:userId'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const userId = String(params.userId);
      const form = mockDb.forms.find(
        (item) =>
          item.eventId === eventId &&
          item.userId === userId &&
          item.status === 'APPLIED',
      );

      if (!form) {
        return notFound('Application form not found.');
      }

      form.attended = false;

      return HttpResponse.json({
        userId,
        isAttended: false,
        summary: getAttendanceSummary(eventId),
      });
    },
  ),

  http.get<{ eventId: string }>(
    apiUrl('/event/:eventId/attendance/guides'),
    ({ params }) => {
      const eventId = Number(params.eventId);

      return HttpResponse.json({
        items: getAppliedForms(eventId)
          .filter((form) => form.attended)
          .map(getFormUser)
          .filter((user) => user.type === 'GUIDE')
          .map((user) => ({
            name: user.name,
            birthDate: user.birthDate,
            id1365: user.id1365,
          })),
      });
    },
  ),
];
