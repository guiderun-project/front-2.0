import { http, HttpResponse, type HttpHandler } from 'msw';

import type {
  EventApplyPatchRequestBody,
  EventApplyPostRequestBody,
} from '@/api/types/application';
import {
  buildAdditionalAnswerDetails,
  buildApplicantForm,
  findEvent,
  getAppliedForms,
  getCanceledForms,
  getCurrentUser,
  getFormUser,
  getParticipantSummary,
  mockDb,
  runningGroups,
  toApplicant,
} from '@/mocks/fixtures';
import { apiUrl, badRequest, notFound } from '@/mocks/http';

const upsertCurrentUserForm = (
  eventId: number,
  body: EventApplyPostRequestBody | EventApplyPatchRequestBody,
) => {
  const currentUser = getCurrentUser();
  let form = mockDb.forms.find(
    (item) => item.eventId === eventId && item.userId === currentUser.userId,
  );

  if (!form) {
    const nextRequestId =
      Math.max(0, ...mockDb.forms.map((item) => item.requestId)) + 1;

    form = {
      requestId: nextRequestId,
      eventId,
      userId: currentUser.userId,
      status: 'APPLIED',
      canceledAt: null,
      group: body.group,
      partner: body.partner ?? null,
      detail: body.detail ?? null,
      competitionInfo: body.competitionInfo ?? null,
      additionalAnswers: body.additionalAnswers ?? [],
      attended: false,
    };
    mockDb.forms.push(form);
  }

  form.status = 'APPLIED';
  form.canceledAt = null;
  form.group = body.group;
  form.partner = body.partner ?? null;
  form.detail = body.detail ?? null;
  form.competitionInfo = body.competitionInfo ?? null;
  form.additionalAnswers = body.additionalAnswers ?? [];

  return form;
};

const createApplicantGroups = (eventId: number) => {
  const forms = getAppliedForms(eventId);

  return runningGroups
    .map((runningGroup) => {
      const applicants = forms
        .filter((form) => form.group === runningGroup)
        .map(toApplicant);

      return {
        runningGroup,
        totalCount: applicants.length,
        applicants,
      };
    })
    .filter((group) => group.totalCount > 0);
};

export const applicationHandlers: HttpHandler[] = [
  http.post<{ eventId: string }>(
    apiUrl('/event/:eventId/form'),
    async ({ params, request }) => {
      const eventId = Number(params.eventId);
      const event = findEvent(eventId);
      const body = (await request.json()) as EventApplyPostRequestBody;

      if (!event) {
        return notFound('Event not found.');
      }

      if (event.eventType === 'COMPETITION' && !body.competitionInfo) {
        return badRequest('competitionInfo is required for competition events.');
      }

      const form = upsertCurrentUserForm(eventId, body);

      return HttpResponse.json({ requestId: form.requestId });
    },
  ),

  http.patch<{ eventId: string }>(
    apiUrl('/event/:eventId/form'),
    async ({ params, request }) => {
      const eventId = Number(params.eventId);
      const event = findEvent(eventId);
      const body = (await request.json()) as EventApplyPatchRequestBody;

      if (!event) {
        return notFound('Event not found.');
      }

      const form = upsertCurrentUserForm(eventId, body);

      return HttpResponse.json({ requestId: form.requestId });
    },
  ),

  http.get<{ eventId: string }>(apiUrl('/event/:eventId/form'), ({ params }) => {
    const eventId = Number(params.eventId);
    const event = findEvent(eventId);
    const currentUser = getCurrentUser();
    const form = mockDb.forms.find(
      (item) =>
        item.eventId === eventId &&
        item.userId === currentUser.userId &&
        item.status === 'APPLIED',
    );

    if (!event || !form) {
      return notFound('Application form not found.');
    }

    return HttpResponse.json({
      eventId,
      eventName: event.name,
      eventType: event.eventType,
      eventCategory: event.eventCategory,
      userType: currentUser.type,
      name: currentUser.name,
      recordDegree: currentUser.recordDegree,
      applicationInfo: {
        group: form.group,
        partner: form.partner,
        detail: form.detail,
      },
      competitionInfo: form.competitionInfo,
      additionalAnswers: buildAdditionalAnswerDetails(eventId, form),
    });
  }),

  http.delete<{ eventId: string }>(
    apiUrl('/event/:eventId/form'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const currentUser = getCurrentUser();
      const form = mockDb.forms.find(
        (item) =>
          item.eventId === eventId && item.userId === currentUser.userId,
      );

      if (!form) {
        return notFound('Application form not found.');
      }

      form.status = 'CANCELED';
      form.canceledAt = new Date().toISOString();
      form.attended = false;

      mockDb.matchings = mockDb.matchings
        .map((matching) =>
          matching.eventId === eventId
            ? {
                ...matching,
                guideIds: matching.guideIds.filter(
                  (guideId) => guideId !== currentUser.userId,
                ),
              }
            : matching,
        )
        .filter(
          (matching) =>
            matching.viId !== currentUser.userId &&
            matching.guideIds.length > 0,
        );

      return new HttpResponse('200 ok', { status: 200 });
    },
  ),

  http.get<{ eventId: string }>(
    apiUrl('/event/:eventId/forms/canceled'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const canceledForms = getCanceledForms(eventId);

      return HttpResponse.json({
        summary: getParticipantSummary(canceledForms),
        canceledApplicants: canceledForms.map((form) => {
          const user = getFormUser(form);

          return {
            userId: user.userId,
            name: user.name,
            type: user.type,
            canceledAt: form.canceledAt,
          };
        }),
      });
    },
  ),

  http.get<{ eventId: string; userId: string }>(
    apiUrl('/event/:eventId/forms/:userId'),
    ({ params }) => {
      const form = buildApplicantForm(
        Number(params.eventId),
        String(params.userId),
      );

      if (!form) {
        return notFound('Application form not found.');
      }

      return HttpResponse.json(form);
    },
  ),

  http.get<{ eventId: string }>(apiUrl('/event/:eventId/forms'), ({ params }) => {
    const eventId = Number(params.eventId);
    const forms = getAppliedForms(eventId);

    return HttpResponse.json({
      summary: getParticipantSummary(forms),
      groups: createApplicantGroups(eventId),
    });
  }),
];
