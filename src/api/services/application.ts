import { privateApi } from '@/api/core/client';
import { handleApiRequest } from '@/api/core/request';
import type {
  EventApplicantFormPath,
  EventApplicantFormResponse,
  EventApplicantListPath,
  EventApplicantListResponse,
  EventApplyCancelPath,
  EventApplyPatchRequest,
  EventApplyPatchResponse,
  EventApplyPostRequest,
  EventApplyPostResponse,
  EventCanceledApplicantListPath,
  EventCanceledApplicantListResponse,
  MyEventApplyGetResponse,
  MyEventApplyPath,
} from '@/api/types/application';

class ApplicationApi {
  /**
   * 이벤트 신청서를 생성하고 참가 신청을 완료한다.
   *
   * @see https://www.notion.so/35e9802df49681309026f6ed0958738a?pvs=1
   */
  createPost = async ({ eventId, body }: EventApplyPostRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.post<EventApplyPostResponse>(
        `/event/${eventId}/form`,
        body,
      );

      return response.data;
    });
  };

  /**
   * 이미 제출한 이벤트 신청서를 수정한다.
   *
   * @see https://www.notion.so/35e9802df49681fb81a7c20260737dbe?pvs=1
   */
  updatePatch = async ({ eventId, body }: EventApplyPatchRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.patch<EventApplyPatchResponse>(
        `/event/${eventId}/form`,
        body,
      );

      return response.data;
    });
  };

  /**
   * 현재 로그인 사용자의 이벤트 신청서를 조회한다.
   *
   * @see https://www.notion.so/3609802df49681e5a985e88fffaa2cd2?pvs=1
   */
  myFormGet = async ({ eventId }: MyEventApplyPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<MyEventApplyGetResponse>(
        `/event/${eventId}/form`,
      );

      return response.data;
    });
  };

  /**
   * 현재 로그인 사용자의 이벤트 신청을 취소한다.
   *
   * @see https://www.notion.so/3609802df4968141b65ad23326300670?pvs=1
   */
  cancelDelete = async ({ eventId }: EventApplyCancelPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.delete<string>(`/event/${eventId}/form`);

      return response.data;
    });
  };

  /**
   * 이벤트에 신청한 참가자 명단과 신청 요약을 조회한다.
   *
   * @see https://www.notion.so/3639802df49681879edee48cfd533ab8?pvs=1
   */
  applicantsGet = async ({ eventId }: EventApplicantListPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<EventApplicantListResponse>(
        `/event/${eventId}/forms`,
      );

      return response.data;
    });
  };

  /**
   * 특정 신청자의 이벤트 신청서 상세를 조회한다.
   *
   * @see https://www.notion.so/3639802df4968176a131eced14981e25?pvs=1
   */
  applicantFormGet = async ({ eventId, userId }: EventApplicantFormPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<EventApplicantFormResponse>(
        `/event/${eventId}/forms/${userId}`,
      );

      return response.data;
    });
  };

  /**
   * 이벤트 신청을 취소한 참가자 명단을 조회한다.
   *
   * @see https://www.notion.so/3639802df49681d18505df13c68cf761?pvs=1
   */
  canceledApplicantsGet = async ({
    eventId,
  }: EventCanceledApplicantListPath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<EventCanceledApplicantListResponse>(
        `/event/${eventId}/forms/canceled`,
      );

      return response.data;
    });
  };
}

const applicationApi = new ApplicationApi();

export default applicationApi;
