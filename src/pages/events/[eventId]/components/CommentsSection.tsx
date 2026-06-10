import { useState, type FormEvent, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { Button, Icon, IconButton, Text } from '@/components';

import { useEventComments } from '../hooks/useEventComments';
import { formatRelativeTime } from '../utils';
import { PanelState } from './PanelState';
import { ProfileAvatar } from './ProfileAvatar';

export const CommentsSection = (): ReactElement => {
  const {
    comments,
    currentUserId,
    handleCreateComment: createComment,
    handleDeleteComment: deleteComment,
    handleUpdateComment: updateComment,
    isCommentMutating,
    isError,
    isPending,
  } = useEventComments();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentFormValue, setCommentFormValue] = useState('');
  const isEditing = editingCommentId !== null;
  const isSubmitDisabled =
    commentFormValue.trim().length === 0 || isCommentMutating;

  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = commentFormValue.trim();

    if (trimmedContent.length === 0) {
      return;
    }

    if (editingCommentId !== null) {
      await updateComment(editingCommentId, trimmedContent);
      setEditingCommentId(null);
    } else {
      await createComment(trimmedContent);
    }

    setCommentFormValue('');
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId);

    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setCommentFormValue('');
    }
  };

  return (
    <CommentSectionRoot>
      <CommentSectionInner>
        <Text as="h2" color="text.secondary" font="heading-s-sb">
          댓글
        </Text>

        <CommentForm onSubmit={handleSubmitComment}>
          <CommentAuthor>
            <ProfileAvatar name="나" type="VI" />
          </CommentAuthor>
          <CommentInput
            aria-label="댓글 입력"
            disabled={isCommentMutating}
            placeholder="해당 모임에 관련한 이야기를 해주세요!"
            value={commentFormValue}
            onChange={(event) => {
              setCommentFormValue(event.target.value);
            }}
          />
          <Button disabled={isSubmitDisabled} fullWidth size="m" type="submit">
            {isEditing ? '수정하기' : '댓글 남기기'}
          </Button>
        </CommentForm>

        {isPending ? (
          <PanelState>댓글을 불러오는 중입니다.</PanelState>
        ) : isError ? (
          <PanelState>댓글을 불러오지 못했습니다.</PanelState>
        ) : comments && comments.items.length > 0 ? (
          <CommentList>
            {comments.items.map((comment) => {
              const isOwnComment = comment.userId === currentUserId;

              return (
                <CommentItem key={comment.commentId}>
                  <CommentHeader>
                    <ProfileAvatar name={comment.name} type={comment.type} />
                    <CommentTime color="text.tertiary" font="detail-m-m">
                      {formatRelativeTime(comment.createdAt)}
                    </CommentTime>
                    {isOwnComment ? (
                      <>
                        <CommentIconButton
                          aria-label="댓글 삭제"
                          disabled={isCommentMutating}
                          icon="trash-lined"
                          iconSize={20}
                          size={24}
                          onClick={() => {
                            void handleDeleteComment(comment.commentId);
                          }}
                        />
                        <CommentIconButton
                          aria-label="댓글 수정"
                          disabled={isCommentMutating}
                          icon="edit-lined"
                          iconSize={20}
                          size={24}
                          onClick={() => {
                            setEditingCommentId(comment.commentId);
                            setCommentFormValue(comment.content);
                          }}
                        />
                      </>
                    ) : null}
                  </CommentHeader>
                  <Text color="text.primary" font="body-m-m">
                    {comment.content}
                  </Text>
                </CommentItem>
              );
            })}
          </CommentList>
        ) : (
          <CommentEmptyState>
            <Icon
              aria-hidden={true}
              color="icon.tertiary"
              icon="alert-circle-filled"
              size={48}
            />
            <Text align="center" color="text.tertiary" font="body-m-m">
              아직 댓글이 없어요
            </Text>
          </CommentEmptyState>
        )}
      </CommentSectionInner>
    </CommentSectionRoot>
  );
};

const CommentSectionRoot = styled.section(({ theme }) => ({
  width: 'auto',
  marginInline: theme.spacing['2xl'],
  padding: theme.spacing['2xl'],
  borderRadius: theme.pxToRem(20),
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.elevated,
}));

const CommentSectionInner = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing['3xl'],
  width: '100%',
}));

const CommentForm = styled.form(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
}));

const CommentAuthor = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const CommentInput = styled.textarea(({ theme }) => ({
  width: '100%',
  minHeight: theme.pxToRem(74),
  height: theme.pxToRem(74),
  padding: theme.spacing.lg,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.md,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.default,
  color: theme.color.text.primary,
  fontFamily: theme.typography['detail-m-m'].fontFamily,
  fontSize: theme.typography['detail-m-m'].fontSize,
  fontWeight: theme.typography['detail-m-m'].fontWeight,
  letterSpacing: theme.typography['detail-m-m'].letterSpacing,
  lineHeight: theme.typography['detail-m-m'].lineHeight,
  resize: 'none',

  '&::placeholder': {
    color: theme.color.text.tertiary,
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.64,
  },
}));

const CommentList = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
}));

const CommentEmptyState = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.lg,
  width: '100%',
  padding: `${theme.spacing['5xl']} ${theme.spacing['2xl']}`,
  boxSizing: 'border-box',
}));

const CommentItem = styled.article(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  width: '100%',
  padding: theme.spacing.lg,
  borderRadius: theme.radius.md,
  boxSizing: 'border-box',
  backgroundColor: theme.color.bg.subtle,
}));

const CommentHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  minHeight: theme.pxToRem(24),
}));

const CommentTime = styled(Text)({
  flex: '1 1 auto',
  minWidth: 0,
});

const CommentIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.color.icon.secondary,
}));
