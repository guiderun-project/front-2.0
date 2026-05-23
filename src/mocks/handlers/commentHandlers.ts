import { http, HttpResponse, type HttpHandler } from 'msw';

import type { EventCommentPostBody } from '@/api/types/comment';
import {
  createPage,
  getCurrentUser,
  getFormUser,
  mockDb,
} from '@/mocks/fixtures';
import { apiUrl, getSearchNumber, notFound } from '@/mocks/http';

export const commentHandlers: HttpHandler[] = [
  http.get<{ eventId: string }>(
    apiUrl('/event/:eventId/comments'),
    ({ params, request }) => {
      const eventId = Number(params.eventId);
      const page = getSearchNumber(request, 'page', 1);
      const size = getSearchNumber(request, 'size', 10);
      const comments = mockDb.comments
        .filter((comment) => comment.eventId === eventId)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
      const startIndex = (page - 1) * size;
      const items = comments.slice(startIndex, startIndex + size).map((comment) => {
        const formLikeUser = mockDb.forms.find(
          (form) => form.userId === comment.userId,
        );
        const user = formLikeUser
          ? getFormUser(formLikeUser)
          : mockDb.users.find((item) => item.userId === comment.userId);

        return {
          commentId: comment.commentId,
          content: comment.content,
          createdAt: comment.createdAt,
          userId: comment.userId,
          name: user?.name ?? 'Unknown',
          type: user?.type ?? 'VI',
        };
      });

      return HttpResponse.json({
        items,
        page: {
          page,
          size,
          totalCount: comments.length,
          totalPages: createPage(page, size, comments.length).totalPages,
        },
      });
    },
  ),

  http.post<{ eventId: string }>(
    apiUrl('/event/:eventId/comments'),
    async ({ params, request }) => {
      const body = (await request.json()) as EventCommentPostBody;
      const currentUser = getCurrentUser();
      const nextCommentId =
        Math.max(0, ...mockDb.comments.map((comment) => comment.commentId)) + 1;

      mockDb.comments.push({
        commentId: nextCommentId,
        eventId: Number(params.eventId),
        userId: currentUser.userId,
        content: body.content,
        createdAt: new Date().toISOString(),
      });

      return HttpResponse.json({ commentId: nextCommentId });
    },
  ),

  http.patch<{ eventId: string; commentId: string }>(
    apiUrl('/event/:eventId/comments/:commentId'),
    async ({ params, request }) => {
      const body = (await request.json()) as EventCommentPostBody;
      const commentId = Number(params.commentId);
      const comment = mockDb.comments.find((item) => item.commentId === commentId);

      if (!comment) {
        return notFound('Comment not found.');
      }

      comment.content = body.content;

      return HttpResponse.json({ commentId });
    },
  ),

  http.delete<{ eventId: string; commentId: string }>(
    apiUrl('/event/:eventId/comments/:commentId'),
    ({ params }) => {
      const commentId = Number(params.commentId);
      const exists = mockDb.comments.some((item) => item.commentId === commentId);

      if (!exists) {
        return notFound('Comment not found.');
      }

      mockDb.comments = mockDb.comments.filter(
        (comment) => comment.commentId !== commentId,
      );

      return HttpResponse.json({ commentId });
    },
  ),
];
