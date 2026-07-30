import { optionalAuthApi, privateApi } from '@/api/core/client';
import { handleApiRequest } from '@/api/core/request';
import type {
  EventClosePath,
  EventCreateRequest,
  EventCreateResponse,
  EventDeletePath,
  EventDetailPath,
  EventDetailResponse,
  EventListGetRequest,
  EventListGetResponse,
  EventRunningDistancePatchRequest,
  EventRunningDistancePatchResponse,
  EventRunningDistancePath,
  EventRunningDistanceSkipPath,
  EventRunningDistanceSkipResponse,
  EventSearchGetRequest,
  EventSearchGetResponse,
  EventsSummaryGetResponse,
  EventUpdatePath,
  EventUpdateRequest,
  EventUpdateResponse,
  MissingRunningDistanceGetResponse,
  UpcomingEventsGetResponse,
} from '@/api/types/event';

class EventApi {
  /**
   * 이벤트 공개 요약과 로그인 사용자의 누적 참여 요약을 조회한다.
   * 비회원은 공개 요약만, 회원은 개인 누적 참여 요약도 함께 받는다.
   *
   * @see https://www.notion.so/35d9802df4968111a2dacb358e745142?pvs=1
   */
  summaryGet = async () => {
    return handleApiRequest(async () => {
      const response =
        await optionalAuthApi.get<EventsSummaryGetResponse>('/event/summary');

      return response.data;
    });
  };

  /**
   * 다가오는 이벤트 목록을 조회한다.
   * 비회원은 공개 모임, 회원은 본인이 참여한 모임을 기준으로 반환된다.
   *
   * @see https://www.notion.so/35d9802df49681b893efce4acc4f02ea?pvs=1
   */
  upcomingGet = async () => {
    return handleApiRequest(async () => {
      const response =
        await optionalAuthApi.get<UpcomingEventsGetResponse>('/event/upcoming');

      return response.data;
    });
  };

  /**
   * 전체 이벤트 목록을 탭, 유형, 모집 상태, 페이지 기준으로 조회한다.
   * totalCount는 pagination에 포함된다.
   *
   * @see https://www.notion.so/35d9802df49681ec8a99e7ffc5ae5baf?pvs=1
   */
  allGet = async (query: EventListGetRequest) => {
    return handleApiRequest(async () => {
      const response = await optionalAuthApi.get<EventListGetResponse>(
        '/event/all',
        { params: query },
      );

      return response.data;
    });
  };

  /**
   * 검색어와 목록 필터 조건으로 이벤트 목록을 검색한다.
   *
   * @see https://www.notion.so/35d9802df49681b9be3aeed1596e240f?pvs=1
   */
  searchGet = async (query: EventSearchGetRequest) => {
    return handleApiRequest(async () => {
      const response = await optionalAuthApi.get<EventSearchGetResponse>(
        '/event/search',
        { params: query },
      );

      return response.data;
    });
  };

  /**
   * 이벤트 상세 정보를 조회한다.
   * 비공개 이벤트도 링크 접근 시 상세 조회가 가능하다.
   *
   * @see https://www.notion.so/3629802df49681339103fa37e3670802?pvs=1
   */
  detailGet = async ({ eventId }: EventDetailPath) => {
    return handleApiRequest(async () => {
      const response = await optionalAuthApi.get<EventDetailResponse>(
        `/event/${eventId}`,
      );

      return response.data;
    });
  };

  /**
   * 이벤트를 생성한다.
   * 비공개 여부, 예상 러닝 거리, 추가정보 질문 정의를 함께 저장할 수 있다.
   *
   * @see https://www.notion.so/35e9802df496814f95a7f823d4c558a3?pvs=1
   */
  createPost = async (body: EventCreateRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.post<EventCreateResponse>(
        '/event',
        body,
      );

      return response.data;
    });
  };

  /**
   * 이벤트 생성과 동일한 주요 필드를 수정한다.
   *
   * @see https://www.notion.so/35e9802df4968186af03fb26e5334eb8?pvs=1
   */
  updatePatch = async ({ eventId, body }: EventUpdatePath & { body: EventUpdateRequest }) => {
    return handleApiRequest(async () => {
      const response = await privateApi.patch<EventUpdateResponse>(
        `/event/${eventId}`,
        body,
      );

      return response.data;
    });
  };

  /**
   * 주최자가 이벤트를 삭제한다.
   *
   * @see https://www.notion.so/35e9802df49681bc91e1d8224a5e17ae?pvs=1
   */
  delete = async ({ eventId }: EventDeletePath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.delete<void>(`/event/${eventId}`);

      return response.data;
    });
  };

  /**
   * 주최자가 이벤트 모집을 조기 마감한다.
   *
   * @see https://www.notion.so/3609802df4968140b54ddb44815e4e00?pvs=1
   */
  closePatch = async ({ eventId }: EventClosePath) => {
    return handleApiRequest(async () => {
      const response = await privateApi.patch<string>(
        `/event/close/${eventId}`,
      );

      return response.data;
    });
  };

  /**
   * 현재 로그인 사용자가 주최한 종료 이벤트 중 러닝 거리 미입력 이벤트를 조회한다.
   *
   * @see https://www.notion.so/35e9802df49681f28560f81a9243c464?pvs=1
   */
  missingRunningDistanceGet = async () => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<MissingRunningDistanceGetResponse>(
        '/event/missing-running-distance',
      );

      return response.data;
    });
  };

  /**
   * 러닝 거리가 비어 있는 이벤트에 예상 러닝 거리를 등록한다.
   *
   * @see https://www.notion.so/35e9802df496816db2f5e231ce44c156?pvs=1
   */
  runningDistancePatch = async ({
    eventId,
    body,
  }: EventRunningDistancePath & { body: EventRunningDistancePatchRequest }) => {
    return handleApiRequest(async () => {
      const response = await privateApi.patch<EventRunningDistancePatchResponse>(
        `/event/${eventId}/running-distance`,
        body,
      );

      return response.data;
    });
  };

  /**
   * 러닝 거리 입력 안내를 건너뛴다. 이후 미입력 조회 대상에서 제외된다.
   *
   * @see https://www.notion.so/35e9802df496816db2f5e231ce44c156?pvs=1
   */
  runningDistanceSkipPatch = async ({
    eventId,
  }: EventRunningDistanceSkipPath) => {
    return handleApiRequest(async () => {
      const response =
        await privateApi.patch<EventRunningDistanceSkipResponse>(
          `/event/${eventId}/running-distance/skip`,
        );

      return response.data;
    });
  };
}

const eventApi = new EventApi();

export default eventApi;
