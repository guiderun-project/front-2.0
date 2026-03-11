import { isAxiosError } from 'axios';

import { axiosInstance, axiosInstanceWithToken } from '../core/client';
import {
  AccessTokenGetResponse,
  CheckCertificationTokenPostRequest,
  CheckCertificationTokenPostResponse,
  CheckDuplicatedPostRequest,
  CheckDuplicatedPostResponse,
  GetCertificationTokenIdPostRequest,
  GetCertificationTokenPasswordPostRequest,
  GetUserIdPostRequest,
  GetUserIdPostResponse,
  GuideSignupPostRequest,
  KakaoAuthPostRequest,
  KakaoAuthPostResponse,
  LoginPostRequest,
  LoginPostResponse,
  RenewalPasswordPatchRequest,
  SignupPostResponse,
  ViSignupPostRequest,
  WithdrawDeleteRequest,
} from '../contracts/auth';
import { ErrorType } from '../contracts/error';

class AuthApi {
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

  kakaoAuthPost = async ({ code }: KakaoAuthPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstance.post<KakaoAuthPostResponse>(
        `/oauth/login/kakao`,
        {},
        { params: { code } },
      );
      return res.data;
    });
  };

  viSignupPost = async (signupData: ViSignupPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post<SignupPostResponse>(
        '/signup/vi',
        signupData,
      );
      return res.data;
    });
  };

  guideSignupPost = async (signupData: GuideSignupPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post<SignupPostResponse>(
        '/signup/guide',
        signupData,
      );
      return res.data;
    });
  };

  accessTokenGet = async () => {
    return this.handleRequest(async () => {
      const res = await axiosInstance.get<AccessTokenGetResponse>(
        '/oauth/login/reissue',
      );
      return res.data.accessToken;
    });
  };

  checkDuplicatedPost = async (id: CheckDuplicatedPostRequest) => {
    return this.handleRequest(async () => {
      const res =
        await axiosInstanceWithToken.post<CheckDuplicatedPostResponse>(
          '/signup/duplicated',
          id,
        );
      return res.data.isUnique;
    });
  };

  loginPost = async (loginData: LoginPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstance.post<LoginPostResponse>(
        '/login',
        loginData,
      );
      return res.data;
    });
  };

  getCertificationTokenPasswordPost = async (
    data: GetCertificationTokenPasswordPostRequest,
  ) => {
    return this.handleRequest(async () => {
      const res = await axiosInstance.post('/sms/password', data);
      return res.data;
    });
  };

  getCertificationTokenIdPost = async (
    data: GetCertificationTokenIdPostRequest,
  ) => {
    return this.handleRequest(async () => {
      const res = await axiosInstance.post('/sms/accountId', data);
      return res.data;
    });
  };

  checkCertificationTokenPost = async (
    token: CheckCertificationTokenPostRequest,
  ) => {
    return this.handleRequest(async () => {
      const res = await axiosInstance.post<CheckCertificationTokenPostResponse>(
        '/sms/token',
        token,
      );
      return res.data.token;
    });
  };

  renewalPasswordPatch = async (data: RenewalPasswordPatchRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstance.patch('/new-password', data);
      return res.data;
    });
  };

  getUserIdPost = async (token: GetUserIdPostRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstance.post<GetUserIdPostResponse>(
        '/accountId',
        token,
      );
      return res.data;
    });
  };

  withdrawDelete = async (data: WithdrawDeleteRequest) => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.delete('/withdrawal', { data });
      return res.data;
    });
  };

  logout = async () => {
    return this.handleRequest(async () => {
      const res = await axiosInstanceWithToken.post('/logout');
      return res;
    });
  };
}

const authApi = new AuthApi();

export default authApi;
