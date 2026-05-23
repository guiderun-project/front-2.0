import { http, HttpResponse, type HttpHandler } from 'msw';

import type { RunningGroup } from '@/api/types/common';
import type {
  MatchingCompletedRow,
  MatchingCreateRequest,
  MatchingRow,
  MatchingUser,
} from '@/api/types/matching';
import {
  buildApplicantForm,
  getAppliedForms,
  getCurrentUser,
  getFormUser,
  getMatching,
  getMatchingSummary,
  isMatched,
  mockDb,
  runningGroups,
  toMatchingUser,
} from '@/mocks/fixtures';
import { apiUrl, notFound } from '@/mocks/http';

type CompletedRowEntry = {
  runningGroup: RunningGroup;
  row: MatchingCompletedRow;
};

type StatusRowEntry = {
  runningGroup: RunningGroup;
  row: MatchingRow;
};

const findAppliedForm = (eventId: number, userId: string) => {
  return getAppliedForms(eventId).find((form) => form.userId === userId);
};

const getMatchingUser = (eventId: number, userId: string) => {
  const form = findAppliedForm(eventId, userId);

  return form ? toMatchingUser(form) : null;
};

const isMatchingUser = (user: MatchingUser | null): user is MatchingUser => {
  return user !== null;
};

const createWaitingGroups = (eventId: number) => {
  const waitingForms = getAppliedForms(eventId).filter(
    (form) => !isMatched(eventId, form.userId),
  );

  return runningGroups
    .map((runningGroup) => {
      const participants = waitingForms
        .filter((form) => form.group === runningGroup)
        .map((form) => {
          const user = getFormUser(form);
          const applicantForm = buildApplicantForm(eventId, user.userId);

          return {
            userId: user.userId,
            name: user.name,
            type: user.type,
            originalRunningGroup: user.recordDegree,
            isFirstParticipation: user.firstParticipation,
            hopePartner: form.partner,
            additionalComment: form.detail,
            additionalAnswers: applicantForm?.additionalAnswers ?? [],
          };
        });

      return {
        runningGroup,
        totalCount: participants.length,
        participants,
      };
    })
    .filter((group) => group.totalCount > 0);
};

const createCompletedRows = (eventId: number): CompletedRowEntry[] => {
  return mockDb.matchings
    .filter((matching) => matching.eventId === eventId)
    .flatMap((matching) => {
      const vi = getMatchingUser(eventId, matching.viId);

      if (!vi) {
        return [];
      }

      return [
        {
          runningGroup: vi.applyGroup,
          row: {
            vi,
            guides: matching.guideIds
              .map((guideId) => getMatchingUser(eventId, guideId))
              .filter(isMatchingUser),
          },
        },
      ];
    });
};

const createCompletedGroups = (eventId: number) => {
  const rows = createCompletedRows(eventId);

  return runningGroups
    .map((runningGroup) => {
      const groupRows = rows
        .filter((item) => item.runningGroup === runningGroup)
        .map((item) => item.row);

      return {
        runningGroup,
        totalCount: groupRows.length,
        rows: groupRows,
      };
    })
    .filter((group) => group.totalCount > 0);
};

const createStatusGroups = (eventId: number) => {
  const matchedRows: StatusRowEntry[] = createCompletedRows(eventId).map(
    (item) => ({
      runningGroup: item.runningGroup,
      row: item.row,
    }),
  );
  const unmatchedRows: StatusRowEntry[] = getAppliedForms(eventId)
    .filter((form) => !isMatched(eventId, form.userId))
    .map((form) => {
      const user = getFormUser(form);
      const matchingUser = toMatchingUser(form);

      return user.type === 'VI'
        ? { runningGroup: form.group, row: { vi: matchingUser, guides: [] } }
        : { runningGroup: form.group, row: { vi: null, guides: [matchingUser] } };
    });
  const rows = [...matchedRows, ...unmatchedRows];

  return runningGroups
    .map((runningGroup) => {
      const groupRows = rows
        .filter((item) => item.runningGroup === runningGroup)
        .map((item) => item.row);

      return {
        runningGroup,
        totalCount: groupRows.length,
        rows: groupRows,
      };
    })
    .filter((group) => group.totalCount > 0);
};

export const matchingHandlers: HttpHandler[] = [
  http.get<{ eventId: string }>(
    apiUrl('/event/:eventId/matching/status'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const currentUser = getCurrentUser();
      const currentMatching = mockDb.matchings.find(
        (matching) =>
          matching.eventId === eventId &&
          (matching.viId === currentUser.userId ||
            matching.guideIds.includes(currentUser.userId)),
      );
      const myPartners = currentMatching
        ? [
            currentMatching.viId,
            ...currentMatching.guideIds,
          ]
            .filter((userId) => userId !== currentUser.userId)
            .map((userId) => getMatchingUser(eventId, userId))
            .filter((user) => Boolean(user))
        : [];

      return HttpResponse.json({
        myPartners,
        groups: createStatusGroups(eventId),
      });
    },
  ),

  http.get<{ eventId: string }>(
    apiUrl('/event/:eventId/matching/waiting'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const waitingForms = getAppliedForms(eventId).filter(
        (form) => !isMatched(eventId, form.userId),
      );

      return HttpResponse.json({
        summary: {
          waitingCount: waitingForms.length,
          viCount: waitingForms.filter(
            (form) => getFormUser(form).type === 'VI',
          ).length,
          guideCount: waitingForms.filter(
            (form) => getFormUser(form).type === 'GUIDE',
          ).length,
        },
        groups: createWaitingGroups(eventId),
      });
    },
  ),

  http.get<{ eventId: string }>(
    apiUrl('/event/:eventId/matching/completed'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const summary = getMatchingSummary(eventId);

      return HttpResponse.json({
        summary: {
          completedViCount: summary.completedViCount,
          matchedGuideCount: summary.matchedGuideCount,
        },
        groups: createCompletedGroups(eventId),
      });
    },
  ),

  http.post<{ eventId: string }>(
    apiUrl('/event/:eventId/matching'),
    async ({ params, request }) => {
      const eventId = Number(params.eventId);
      const body = (await request.json()) as MatchingCreateRequest;
      const viForm = findAppliedForm(eventId, body.viId);

      if (!viForm || getFormUser(viForm).type !== 'VI') {
        return notFound('VI applicant not found.');
      }

      const guideIds = body.guideIds.filter((guideId) => {
        const guideForm = findAppliedForm(eventId, guideId);

        return guideForm && getFormUser(guideForm).type === 'GUIDE';
      });

      const existingMatching = getMatching(eventId, body.viId);

      if (existingMatching) {
        existingMatching.guideIds = guideIds;
      } else {
        mockDb.matchings.push({
          eventId,
          viId: body.viId,
          guideIds,
        });
      }

      return HttpResponse.json({
        viId: body.viId,
        guideIds,
        summary: getMatchingSummary(eventId),
      });
    },
  ),

  http.delete<{ eventId: string; viId: string }>(
    apiUrl('/event/:eventId/matching/:viId'),
    ({ params }) => {
      const eventId = Number(params.eventId);
      const viId = String(params.viId);
      const matching = getMatching(eventId, viId);

      if (!matching) {
        return notFound('Matching not found.');
      }

      mockDb.matchings = mockDb.matchings.filter(
        (item) => !(item.eventId === eventId && item.viId === viId),
      );

      return HttpResponse.json({
        viId,
        canceledGuideIds: matching.guideIds,
        summary: getMatchingSummary(eventId),
      });
    },
  ),
];
