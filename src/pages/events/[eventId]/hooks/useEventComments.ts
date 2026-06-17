import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { api } from '@/api/services';
import { useAuth } from '@/contexts';

import { eventDetailQueryKeys } from '../queryKeys';
import { isApprovedUser } from '../utils';

export const useEventComments = () => {
  const { eventId: eventIdParam } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const eventId = Number(eventIdParam);
  const isValidEventId = Number.isInteger(eventId) && eventId > 0;
  const canAccessComments = isApprovedUser(user);
  const currentUserId = user?.userId ?? null;
  const commentsQueryKey = eventDetailQueryKeys.comments(eventId);

  const commentsQuery = useQuery({
    queryKey: commentsQueryKey,
    queryFn: () => api.comment.listGet({ eventId, page: 1, size: 10 }),
    enabled: isValidEventId && canAccessComments,
  });
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => {
      return api.comment.createPost({
        eventId,
        body: { content },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    },
  });
  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      return api.comment.updatePatch({
        eventId,
        commentId,
        body: { content },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    },
  });
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => {
      return api.comment.delete({
        eventId,
        commentId,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    },
  });

  const handleCreateComment = (content: string) => {
    return createCommentMutation.mutateAsync(content);
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    return updateCommentMutation.mutateAsync({ commentId, content });
  };

  const handleDeleteComment = (commentId: number) => {
    return deleteCommentMutation.mutateAsync(commentId);
  };

  return {
    comments: commentsQuery.data,
    currentUserId,
    handleCreateComment,
    handleDeleteComment,
    handleUpdateComment,
    isCommentMutating:
      createCommentMutation.isPending ||
      updateCommentMutation.isPending ||
      deleteCommentMutation.isPending,
    isError: commentsQuery.isError,
    isPending: commentsQuery.isPending,
  };
};
