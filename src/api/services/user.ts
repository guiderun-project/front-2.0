import { privateApi } from '@/api/core/client';
import { handleApiRequest } from '@/api/core/request';
import type {
  CheckAccountDuplicatedRequest,
  CheckAccountDuplicatedResponse,
  MyActivityEventsQuery,
  MyActivityEventsResponse,
  MyActivityPartnersQuery,
  MyActivityPartnersResponse,
  MyPageResponse,
  SetAccountRequest,
  SetAccountResponse,
  UpdatePersonalInfoRequest,
  UpdatePersonalInfoResponse,
  UpdateRunningInfoRequest,
  UpdateRunningInfoResponse,
  UserBirthDatePatchRequest,
  UserBirthDatePatchResponse,
  UserInfoGetResponse,
  UserWithdrawalDeleteRequest,
} from '@/api/types/user';

class UserApi {
  /**
   * 로그인된 본인의 기본 사용자 정보를 조회한다.
   *
   * @see https://www.notion.so/3609802df49681f6bbc9f63544d16967?pvs=1
   */
  personalGet = async () => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<UserInfoGetResponse>(
        '/user/personal',
      );

      return response.data;
    });
  };

  /**
   * 생년월일이 없는 기존 회원의 생년월일을 등록한다.
   *
   * @see https://www.notion.so/35e9802df49681a79e06e0cdcb013bf5?pvs=1
   */
  birthDatePatch = async (body: UserBirthDatePatchRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.patch<UserBirthDatePatchResponse>(
        '/user/personal/birth-date',
        body,
      );

      return response.data;
    });
  };

  /**
   * 본인의 프로필, 참여 현황, 개인정보, 러닝 정보를 통합 조회한다.
   *
   * @see https://www.notion.so/35e9802df496819e9ac5f1fe0dbc88dc?pvs=1
   */
  myPageGet = async () => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<MyPageResponse>('/user/mypage');

      return response.data;
    });
  };

  /**
   * 본인의 기본 인적사항을 수정한다.
   * accountId는 이 API에서 수정하지 않는다.
   *
   * @see https://www.notion.so/35e9802df496816c95ecfa78c2ae2477?pvs=1
   */
  personalPatch = async (body: UpdatePersonalInfoRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.patch<UpdatePersonalInfoResponse>(
        '/user/personal',
        body,
      );

      return response.data;
    });
  };

  /**
   * VI/Guide 공통 러닝 정보를 수정한다.
   *
   * @see https://www.notion.so/35e9802df49681eca929c191825f3fba?pvs=1
   */
  runningPatch = async (body: UpdateRunningInfoRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.patch<UpdateRunningInfoResponse>(
        '/user/running',
        body,
      );

      return response.data;
    });
  };

  /**
   * 소셜 로그인 이후 아이디/비밀번호가 없는 회원의 계정을 최초 설정한다.
   *
   * @see https://www.notion.so/35e9802df49681a29998f28de3c1a4cf?pvs=1
   */
  accountPost = async (body: SetAccountRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.post<SetAccountResponse>(
        '/user/account',
        body,
      );

      return response.data;
    });
  };

  /**
   * accountId 사용 가능 여부를 확인한다.
   *
   * @see https://www.notion.so/35e9802df49681d5a48ae8675d84be32?pvs=1
   */
  accountDuplicatedPost = async (body: CheckAccountDuplicatedRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.post<CheckAccountDuplicatedResponse>(
        '/user/account/duplicated',
        body,
      );

      return response.data;
    });
  };

  /**
   * 선택한 탈퇴 사유를 저장하고 회원 탈퇴를 처리한다.
   *
   * @see https://www.notion.so/35e9802df4968121bbedcb83130b8049?pvs=1
   */
  withdrawalDelete = async (body: UserWithdrawalDeleteRequest) => {
    return handleApiRequest(async () => {
      const response = await privateApi.delete<void>('/user', { data: body });

      return response.data;
    });
  };

  /**
   * 내가 참여했거나 주최한 이벤트 목록을 조회한다.
   *
   * @see https://www.notion.so/35e9802df4968118a75dc860b581d17d?pvs=1
   */
  activityEventsGet = async (query: MyActivityEventsQuery = {}) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<MyActivityEventsResponse>(
        '/user/activity/events',
        { params: query },
      );

      return response.data;
    });
  };

  /**
   * 나와 함께 달린 파트너 목록을 조회한다.
   *
   * @see https://www.notion.so/35e9802df496810e8d0fe94079125025?pvs=1
   */
  activityPartnersGet = async (query: MyActivityPartnersQuery = {}) => {
    return handleApiRequest(async () => {
      const response = await privateApi.get<MyActivityPartnersResponse>(
        '/user/activity/partners',
        { params: query },
      );

      return response.data;
    });
  };
}

const userApi = new UserApi();

export default userApi;
