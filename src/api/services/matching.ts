import { privateApi } from '@/api/core/client';
import { handleApiRequest } from '@/api/core/request';
import type {
  EventMatchingStatusPath,
  EventMatchingStatusResponse,
  MatchingCancelPath,
  MatchingCancelResponse,
  MatchingCompletedPath,
  MatchingCompletedResponse,
  MatchingCreateInput,
  MatchingCreateResponse,
  MatchingWaitingPath,
  MatchingWaitingResponse,
} from '@/api/types/matching';

class MatchingApi {
  /**
   * 이벤트의 매칭 대기/완료 요약을 조회한다.
   *
   * @see https://www.notion.so/3639802df496810cb387e78fc95c6795?pvs=1
   */
  statusGet = async ({ eventId }: EventMatchingStatusPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<EventMatchingStatusResponse>(
        `/event/${eventId}/matching/status`,
      );

      return response.data;
    });
  };

  /**
   * 이벤트에서 아직 매칭되지 않은 참가자 명단을 조회한다.
   *
   * @see https://www.notion.so/3639802df4968172a099ce631d5722f3?pvs=1
   */
  waitingGet = async ({ eventId }: MatchingWaitingPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<MatchingWaitingResponse>(
        `/event/${eventId}/matching/waiting`,
      );

      return response.data;
    });
  };

  /**
   * 이벤트에서 매칭이 완료된 VI와 가이드러너 명단을 조회한다.
   *
   * @see https://www.notion.so/3639802df49681b3ac59ff03e4a4606e?pvs=1
   */
  completedGet = async ({ eventId }: MatchingCompletedPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<MatchingCompletedResponse>(
        `/event/${eventId}/matching/completed`,
      );

      return response.data;
    });
  };

  /**
   * VI 참가자와 가이드러너를 매칭한다.
   *
   * @see https://www.notion.so/3639802df49681a6b6eddff950816e67?pvs=1
   */
  createPost = async ({ eventId, body }: MatchingCreateInput) => {
    return handleApiRequest(async () => {
      const response = await privateApi.post<MatchingCreateResponse>(
        `/event/${eventId}/matching`,
        body,
      );

      return response.data;
    });
  };

  /**
   * 특정 VI 참가자의 매칭을 취소한다.
   *
   * @see https://www.notion.so/3639802df496816aa393da86dd9a1bfe?pvs=1
   */
  cancelDelete = async ({ eventId, viId }: MatchingCancelPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.delete<MatchingCancelResponse>(
        `/event/${eventId}/matching/${viId}`,
      );

      return response.data;
    });
  };
}

const matchingApi = new MatchingApi();

export default matchingApi;
