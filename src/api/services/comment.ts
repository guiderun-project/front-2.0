import { privateApi } from '@/api/core/client';
import { handleApiRequest } from '@/api/core/request';
import type {
  EventCommentDeletePath,
  EventCommentDeleteResponse,
  EventCommentGetRequest,
  EventCommentGetResponse,
  EventCommentPatchRequest,
  EventCommentPatchResponse,
  EventCommentPostRequest,
  EventCommentPostResponse,
} from '@/api/types/comment';

class CommentApi {
  /**
   * 이벤트 댓글 목록을 페이지 단위로 조회한다.
   *
   * @see https://www.notion.so/3609802df49681faae64e12f7818a89f?pvs=1
   */
  listGet = async ({ eventId, page, size }: EventCommentGetRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<EventCommentGetResponse>(
        `/event/${eventId}/comments`,
        { params: { page, size } },
      );

      return response.data;
    });
  };

  /**
   * 이벤트 댓글을 작성한다.
   *
   * @see https://www.notion.so/3609802df49681fa82c3e1c7efde38ca?pvs=1
   */
  createPost = async ({ eventId, body }: EventCommentPostRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.post<EventCommentPostResponse>(
        `/event/${eventId}/comments`,
        body,
      );

      return response.data;
    });
  };

  /**
   * 본인이 작성한 이벤트 댓글 내용을 수정한다.
   *
   * @see https://www.notion.so/3609802df49681b49557d8239aaee3b5?pvs=1
   */
  updatePatch = async ({ eventId, commentId, body }: EventCommentPatchRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.patch<EventCommentPatchResponse>(
        `/event/${eventId}/comments/${commentId}`,
        body,
      );

      return response.data;
    });
  };

  /**
   * 본인이 작성한 이벤트 댓글을 삭제한다.
   *
   * @see https://www.notion.so/3609802df49681b5a894fbc405961599?pvs=1
   */
  delete = async ({ eventId, commentId }: EventCommentDeletePath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.delete<EventCommentDeleteResponse>(
        `/event/${eventId}/comments/${commentId}`,
      );

      return response.data;
    });
  };
}

const commentApi = new CommentApi();

export default commentApi;
