import { publicApi } from '@/api/core/client';
import { handleApiRequest } from '@/api/core/request';
import type {
  AccessTokenReissuePostResponse,
  AccountIdVerificationIssueRequest,
  CheckCertificationTokenPostRequest,
  CheckCertificationTokenPostResponse,
  GetUserIdPostRequest,
  GetUserIdPostResponse,
  KakaoOAuthLoginQuery,
  KakaoOAuthLoginResponse,
  LoginPostRequest,
  LoginPostResponse,
  PasswordVerificationIssueRequest,
  RenewalPasswordPatchRequest,
  SignupPostInput,
  SignupPostResponse,
  SmsVerificationExtendRequest,
  SmsVerificationExtendResponse,
  SmsVerificationIssueResponse,
} from '@/api/types/auth';

class AuthApi {
  /**
   * 카카오 인가 코드로 로그인한다.
   * 기존 회원은 accessToken을 받고, 신규 회원은 signupToken을 받아 회원가입 플로우로 이동한다.
   *
   * @see https://www.notion.so/35d9802df49681408cc1d6d33c9abe49?pvs=1
   */
  kakaoOAuthLoginPost = async ({ code }: KakaoOAuthLoginQuery) => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<KakaoOAuthLoginResponse>(
        '/oauth/login/kakao',
        undefined,
        { params: { code } },
      );

      return response.data;
    });
  };

  /**
   * 계정 ID와 비밀번호로 일반 로그인을 수행한다.
   * refreshToken은 HttpOnly Cookie로 내려오고, 응답 body에는 accessToken만 포함된다.
   *
   * @see https://www.notion.so/3609802df49681f8b696c040bee5e2ce?pvs=1
   */
  loginPost = async (body: LoginPostRequest) => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<LoginPostResponse>('/login', body);

      return response.data;
    });
  };

  /**
   * HttpOnly Cookie의 refreshToken으로 accessToken을 재발급한다.
   * 성공 시 서버가 refreshToken을 rotate하여 Cookie를 다시 설정한다.
   *
   * @see https://www.notion.so/3609802df4968169b886ccfa28d80797?pvs=1
   */
  accessTokenReissuePost = async () => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<AccessTokenReissuePostResponse>(
        '/oauth/login/reissue',
      );

      return response.data;
    });
  };

  /**
   * refreshToken Cookie를 기준으로 로그아웃한다.
   * accessToken 만료 상태에서도 호출 가능한 API다.
   *
   * @see https://www.notion.so/35e9802df49681e7bf7ad435e3d345e1?pvs=1
   */
  logoutPost = async () => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<void>('/logout');

      return response.data;
    });
  };

  /**
   * 소셜 인증 이후 신규 사용자의 VI 또는 Guide 회원가입을 완료한다.
   * signupToken을 Authorization 헤더로 전달한다.
   *
   * @see https://www.notion.so/35d9802df496818e8882cb9190a1d1d5?pvs=1
   */
  signupPost = async ({ signupToken, body }: SignupPostInput) => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<SignupPostResponse>(
        '/signup',
        body,
        {
          headers: {
            Authorization: `Bearer ${signupToken}`,
          },
        },
      );

      return response.data;
    });
  };

  /**
   * 아이디 찾기용 SMS 인증번호를 요청한다.
   * 인증 세션 ID와 만료 정보를 반환한다.
   *
   * @see https://www.notion.so/35d9802df496811da43bc62d4b817b6b?pvs=1
   */
  accountIdVerificationIssuePost = async (
    body: AccountIdVerificationIssueRequest,
  ) => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<SmsVerificationIssueResponse>(
        '/sms/accountId',
        body,
      );

      return response.data;
    });
  };

  /**
   * 비밀번호 찾기용 SMS 인증번호를 요청한다.
   * 계정 ID와 전화번호가 일치하는 사용자를 대상으로 한다.
   *
   * @see https://www.notion.so/35d9802df496815d8a66f16822a5cb80?pvs=1
   */
  passwordVerificationIssuePost = async (
    body: PasswordVerificationIssueRequest,
  ) => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<SmsVerificationIssueResponse>(
        '/sms/password',
        body,
      );

      return response.data;
    });
  };

  /**
   * SMS 인증번호를 검증하고 후속 API 호출용 임시 토큰을 발급받는다.
   *
   * @see https://www.notion.so/35d9802df4968107ada8e6bad9ae5750?pvs=1
   */
  checkCertificationTokenPost = async (
    body: CheckCertificationTokenPostRequest,
  ) => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<CheckCertificationTokenPostResponse>(
        '/sms/token',
        body,
      );

      return response.data;
    });
  };

  /**
   * 기존 인증번호를 재발송하지 않고 SMS 인증 세션의 제한시간을 연장한다.
   *
   * @see https://www.notion.so/35d9802df4968149b6c1e24c686cc5ea?pvs=1
   */
  smsVerificationExtendPost = async (body: SmsVerificationExtendRequest) => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<SmsVerificationExtendResponse>(
        '/sms/verification/extend',
        body,
      );

      return response.data;
    });
  };

  /**
   * SMS 인증 성공 후 발급된 임시 토큰으로 아이디 찾기 결과를 조회한다.
   *
   * @see https://www.notion.so/35d9802df49681bdb448eba0ae82bcbb?pvs=1
   */
  accountIdPost = async (body: GetUserIdPostRequest) => {
    return handleApiRequest(async () => {
      const response = await publicApi.post<GetUserIdPostResponse>(
        '/accountId',
        body,
      );

      return response.data;
    });
  };

  /**
   * SMS 인증 성공 후 발급된 임시 토큰으로 새 비밀번호를 설정한다.
   *
   * @see https://www.notion.so/35d9802df4968124bff5e471686d9333?pvs=1
   */
  newPasswordPatch = async (body: RenewalPasswordPatchRequest) => {
    return handleApiRequest(async () => {
      const response = await publicApi.patch<void>('/new-password', body);

      return response.data;
    });
  };
}

const authApi = new AuthApi();

export default authApi;
