import type { PageInfo, UserType } from './common';

export type EventCommentPath = {
  eventId: number;
};

export type EventCommentGetRequest = EventCommentPath & {
  page: number;
  size: number;
};

export type EventCommentGetResponse = {
  items: Array<{
    commentId: number;
    content: string;
    createdAt: string;
    userId: string;
    name: string;
    type: UserType;
  }>;
  page: PageInfo;
};

export type EventCommentPostBody = {
  content: string;
};

export type EventCommentPostRequest = EventCommentPath & {
  body: EventCommentPostBody;
};

export type EventCommentPostResponse = {
  commentId: number;
};

export type EventCommentEditPath = EventCommentPath & {
  commentId: number;
};

export type EventCommentPatchRequest = EventCommentEditPath & {
  body: EventCommentPostBody;
};

export type EventCommentPatchResponse = {
  commentId: number;
};

export type EventCommentDeletePath = EventCommentEditPath;

export type EventCommentDeleteResponse = {
  commentId: number;
};
