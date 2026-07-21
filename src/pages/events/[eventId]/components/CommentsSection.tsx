import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from 'react';

import styled from '@emotion/styled';

import { getApiErrorMessage } from '@/api/core';
import {
  Button,
  HiddenText,
  Icon,
  IconButton,
  Text,
  useToast,
} from '@/components';

import { useAnnouncedMessage } from '@/hooks/useAnnouncedMessage';
import { useEventComments } from '../hooks/useEventComments';
import { formatRelativeTime } from '../utils';
import { AnnouncedPanelState } from './PanelState';
import { ProfileAvatar } from './ProfileAvatar';

const COMMENT_LABEL_PREVIEW_LENGTH = 20;

type CommentFocusTarget = 'heading' | 'textarea';

export const CommentsSection = (): ReactElement => {
  const {
    comments,
    currentUserId,
    error,
    handleCreateComment: createComment,
    handleDeleteComment: deleteComment,
    handleUpdateComment: updateComment,
    isCommentMutating,
    isError,
    isPending,
  } = useEventComments();
  const { showToast } = useToast();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentFormValue, setCommentFormValue] = useState('');
  const [announcement, setAnnouncement] = useState({
    message: '',
    revision: 0,
  });
  const [pendingFocusTarget, setPendingFocusTarget] =
    useState<CommentFocusTarget | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const sectionInnerRef = useRef<HTMLDivElement>(null);
  const announcedMessage = useAnnouncedMessage(
    announcement.message,
    announcement.revision,
  );
  const isEditing = editingCommentId !== null;
  const isSubmitDisabled =
    commentFormValue.trim().length === 0 || isCommentMutating;

  const announce = (message: string) => {
    setAnnouncement((previous) => ({
      message,
      revision: previous.revision + 1,
    }));
  };

  // 제출/삭제 중 disabled 처리와 댓글 언마운트로 DOM 포커스가 body 로 떨어지므로,
  // mutation 이 끝난 뒤 다음 프레임에 예약된 목적지로 포커스를 복귀시킨다.
  useEffect(() => {
    if (isCommentMutating || pendingFocusTarget === null) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      if (pendingFocusTarget === 'textarea') {
        commentInputRef.current?.focus();
      } else {
        sectionInnerRef.current?.querySelector<HTMLElement>('h2')?.focus();
      }

      setPendingFocusTarget(null);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isCommentMutating, pendingFocusTarget]);

  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = commentFormValue.trim();

    if (trimmedContent.length === 0) {
      return;
    }

    const wasEditing = editingCommentId !== null;

    try {
      if (editingCommentId !== null) {
        await updateComment(editingCommentId, trimmedContent);
        setEditingCommentId(null);
      } else {
        await createComment(trimmedContent);
      }

      setCommentFormValue('');
      announce(wasEditing ? '댓글을 수정했어요.' : '댓글을 등록했어요.');
    } catch (submitError) {
      showToast({
        type: 'error',
        icon: 'alert-circle-filled',
        content: getApiErrorMessage(
          submitError,
          wasEditing ? '댓글 수정에 실패했습니다.' : '댓글 등록에 실패했습니다.',
        ),
      });
    } finally {
      setPendingFocusTarget('textarea');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);

      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setCommentFormValue('');
      }

      announce('댓글을 삭제했어요.');
    } catch (deleteError) {
      showToast({
        type: 'error',
        icon: 'alert-circle-filled',
        content: getApiErrorMessage(deleteError, '댓글 삭제에 실패했습니다.'),
      });
    } finally {
      // 삭제 중 disabled 처리로 포커스가 body 로 떨어진 상태가 실패 시에도 남으므로,
      // 등록/수정과 동일하게 성공/실패 모두 포커스 복귀를 예약한다.
      setPendingFocusTarget('heading');
    }
  };

  const handleStartEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setCommentFormValue(content);
    // 값이 채워진 뒤 입력창으로 포커스를 옮겨 수정 모드 진입을 낭독시킨다.
    window.requestAnimationFrame(() => {
      const input = commentInputRef.current;

      if (!input) {
        return;
      }

      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  };

  return (
    <CommentSectionRoot>
      <CommentSectionInner ref={sectionInnerRef}>
        <HiddenText role="status">{announcedMessage}</HiddenText>
        <Text
          as="h2"
          color="text.secondary"
          font="heading-s-sb"
          tabIndex={-1}
        >
          댓글
        </Text>

        <CommentForm onSubmit={handleSubmitComment}>
          {/* 아바타 유형이 VI 로 하드코딩되어 있어 가이드러너에게 잘못 낭독되므로 장식 처리한다. */}
          <CommentAuthor aria-hidden={true}>
            <ProfileAvatar name="나" type="VI" />
          </CommentAuthor>
          <CommentInput
            ref={commentInputRef}
            aria-label={isEditing ? '댓글 수정 입력' : '댓글 입력'}
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
          <AnnouncedPanelState role="status">
            댓글을 불러오는 중입니다.
          </AnnouncedPanelState>
        ) : isError ? (
          <AnnouncedPanelState role="alert">
            {getApiErrorMessage(error, '댓글을 불러오지 못했습니다.')}
          </AnnouncedPanelState>
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
                          aria-label={`댓글 삭제: ${getCommentPreview(comment.content)}`}
                          disabled={isCommentMutating}
                          icon="trash-lined"
                          iconSize={20}
                          size={24}
                          onClick={() => {
                            void handleDeleteComment(comment.commentId);
                          }}
                        />
                        <CommentIconButton
                          aria-label={`댓글 수정: ${getCommentPreview(comment.content)}`}
                          disabled={isCommentMutating}
                          icon="edit-lined"
                          iconSize={20}
                          size={24}
                          onClick={() => {
                            handleStartEditComment(
                              comment.commentId,
                              comment.content,
                            );
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

// 로터/스와이프로 버튼만 탐색해도 대상 댓글을 구분할 수 있게 내용 앞부분을 라벨에 포함한다.
const getCommentPreview = (content: string) => {
  return content.slice(0, COMMENT_LABEL_PREVIEW_LENGTH);
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
