import { isAxiosError } from 'axios';

import { axiosInstanceWithToken } from '../core/client';
import { ErrorType } from '../contracts/error';
import type {
  EventHistoryCountGetRequest,
  EventHistoryCountGetResponse,
  EventHistoryGetRequest,
  EventHistoryGetResponse,
  LikePostRequest,
  MyPageGetResponse,
  PartnerListCountGetRequest,
  PartnerListCountGetResponse,
  PartnerListGetRequest,
  PartnerListGetResponse,
  PermissionGetRequest,
  PermissionGetResponse,
  PermissionPatchRequest,
  PermissionPatchResponse,
  PersonalInfoGetRequest,
  PersonalInfoGetResponse,
  PersonalInfoPatchRequest,
  PersonalInfoPatchResponse,
  UserProfileGetRequest,
  UserProfileGetResponse,
  ProfileImagePostRequest,
  ProfileImagePostResponse,
  RunningSpecGuideGetRequest,
  RunningSpecGuideGetResponse,
  RunningSpecGuidePatchRequest,
  RunningSpecGuidePatchResponse,
  RunningSpecViGetRequest,
  RunningSpecViGetResponse,
  RunningSpecViPatchRequest,
  RunningSpecViPatchResponse,
  UserInfoGetResponse,
  UserInfoAllGetResponse,
  UserPersonal1365IdPostRequest,
} from '../contracts/info';

import { RecruitStatus } from '@/api/contracts/common/group';
import { PartnerSort } from '@/api/contracts/common/sort';

class InfoApi {
  private async handleRequest<T>(request: () => Promise<T>) {
    try {
      return await request();
    } catch (error) {
      if (isAxiosError<ErrorType>(error)) {
        throw error;
      }
      throw new Error('예상치 못한 에러 발생');
    }
  }
  /**
   * @returns 마이페이지 상단에 있는 값 반환
   */
  myPageGet = async () => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<MyPageGetResponse>('/user/mypage');
      return res.data;
    });
  };

  /**
   * @returns userId를 포함한 값 반환
   */
  userInfoGet = async () => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<UserInfoGetResponse>('/user/personal');
      return res.data;
    });
  };

  /**
   * @return 회원가입 시 입력한 기본 인적사항 반환
   */
  personalInfoGet = async ({ userId }: PersonalInfoGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<PersonalInfoGetResponse>(
        `/user/personal/${userId}`,
      );
      return res.data;
    });
  };

  personalInfoPatch = async (updateData: PersonalInfoPatchRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.patch<PersonalInfoPatchResponse>(
        '/user/personal',
        updateData,
      );
      return res.data;
    });
  };

  /**
   * @returns 회원가입 인적사항 중 러닝 스펙과 관련된 내용 반환
   */
  runningSpecGuideGet = async ({ userId }: RunningSpecGuideGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<RunningSpecGuideGetResponse>(
        `/user/running/guide/${userId}`,
      );
      return res.data;
    });
  };

  runningSpecGuidePatch = async (updataData: RunningSpecGuidePatchRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.patch<RunningSpecGuidePatchResponse>(
          '/user/running/guide',
          updataData,
        );
      return res.data;
    });
  };

  /**
   * @returns 시각 장애 러너 러닝 스펙 반환
   */
  runningSpecViGet = async ({ userId }: RunningSpecViGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<RunningSpecViGetResponse>(
        `/user/running/vi/${userId}`,
      );
      return res.data;
    });
  };

  runningSpecViPatch = async (updateData: RunningSpecViPatchRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.patch<RunningSpecViPatchResponse>(
          '/user/running/vi',
          updateData,
        );
      return res.data;
    });
  };

  /**
   * @returns 권한 동의 여부 반환
   */
  permissionGet = async ({ userId }: PermissionGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<PermissionGetResponse>(
        `/user/permission/${userId}`,
      );
      return res.data;
    });
  };

  permissionPatch = async (updateData: PermissionPatchRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.patch<PermissionPatchResponse>(
        '/user/permission',
        updateData,
      );
      return res.data;
    });
  };

  /**
   * 다른 사용자 정보를 search할 때 사용하는 api
   * @returns 사용자 기초 정보를 반환
   */
  userProfileGet = async ({ userId }: UserProfileGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<UserProfileGetResponse>(
        `/user/profile/${userId}`,
      );
      return res.data;
    });
  };

  /**
   * 함께 뛰었던 파트너 조회
   * @returns
   */
  partnerListGet = async ({
    userId,
    sort = PartnerSort.Count,
    limit = 4,
    start = 0,
  }: PartnerListGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<PartnerListGetResponse>(
        `/user/partner-list/${userId}`,
        { params: { sort, limit, start } },
      );
      return res.data.items;
    });
  };

  partnerListCountGet = async ({ userId }: PartnerListCountGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<PartnerListCountGetResponse>(
        `/user/partner-list/count/${userId}`,
      );
      return res.data.count;
    });
  };

  /**
   * 내가 참여한(신청한) 이벤트 목록 조회
   * @returns 내가 참여한 이벤트 목록 반환
   */
  eventHistoryGet = async ({
    userId,
    sort = RecruitStatus.All,
    limit = 3,
    start = 0,
    year,
  }: EventHistoryGetRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.get<EventHistoryGetResponse>(
        `/user/event-history/${userId}`,
        { params: { kind: sort, limit, start, year } },
      );
      return res.data;
    });
  };

  eventHistoryCountGet = async ({
    userId,
    sort = RecruitStatus.All,
    year,
  }: EventHistoryCountGetRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<EventHistoryCountGetResponse>(
          `/user/event-history/count/${userId}`,
          { params: { sort, year } },
        );
      return res.data.count;
    });
  };

  profileImagePost = async ({ image }: ProfileImagePostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post<ProfileImagePostResponse>(
        '/user/img',
        image,
      );
      return res.data.img;
    });
  };

  likePost = async ({ userId }: LikePostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post(`/user/like/${userId}`);
      return res.data;
    });
  };

  userInfoAllGet = async () => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.get<UserInfoAllGetResponse>(
          '/user/info/all',
        );
      return res.data;
    });
  };

  userPersonal1365IdPost = async (data: UserPersonal1365IdPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post(
        '/user/personal/1365id',
        data,
      );

      return res;
    });
  };
}

const infoApi = new InfoApi();

export default infoApi;
