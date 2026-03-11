import { http, HttpHandler, HttpResponse } from 'msw';

import { NoneType } from '../handlers';

import { baseURL } from '@/api/core/client';
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
  KakaoAuthPostResponse,
  LoginPostRequest,
  LoginPostResponse,
  RenewalPasswordPatchRequest,
  SignupPostResponse,
  ViSignupPostRequest,
  WithdrawDeleteRequest,
} from '@/api/contracts/auth';
import { RoleEnum } from '@/api/contracts/common/group';

const SIGN_UP_DATA: SignupPostResponse = {
  accessToken: '123',
  role: RoleEnum.Admin,
  userId: '123',
};

export const authHandlers: HttpHandler[] = [
  //kakaoAuthPost
  http.post<NoneType, NoneType, KakaoAuthPostResponse>(
    baseURL + '/oauth/login/kakao',
    () => {
      return HttpResponse.json({ accessToken: '123', isExist: false });
    },
  ),

  //viSignupPost
  http.post<NoneType, ViSignupPostRequest, SignupPostResponse>(
    baseURL + '/signup/vi',
    () => {
      return HttpResponse.json(SIGN_UP_DATA);
    },
  ),

  //guideSignupPost
  http.post<NoneType, GuideSignupPostRequest, SignupPostResponse>(
    baseURL + '/signup/guide',
    () => {
      return HttpResponse.json(SIGN_UP_DATA);
    },
  ),

  //accessTokenGet
  http.get<NoneType, NoneType, AccessTokenGetResponse>(
    baseURL + '/oauth/login/reissue',
    () => {
      return HttpResponse.json({ accessToken: '123', isExist: true });
    },
  ),

  //checkDuplicatedPost
  http.post<NoneType, CheckDuplicatedPostRequest, CheckDuplicatedPostResponse>(
    baseURL + '/signup/duplicated',
    () => {
      return HttpResponse.json({ isUnique: true });
    },
  ),

  //loginPost
  http.post<NoneType, LoginPostRequest, LoginPostResponse>(
    baseURL + '/login',
    () => {
      return HttpResponse.json({ accessToken: '123', isExist: true });
      // return HttpResponse.json({}, { status: 500 });
    },
  ),

  // getCertificationTokenPasswordPost
  http.post<NoneType, GetCertificationTokenPasswordPostRequest>(
    baseURL + '/sms/password',
    () => {
      return HttpResponse.json();
    },
  ),

  // getCertificationTokenIdPost
  http.post<NoneType, GetCertificationTokenIdPostRequest>(
    baseURL + '/sms/accountId',
    () => {
      return HttpResponse.json();
    },
  ),

  //checkCertificationTokenPost
  http.post<
    NoneType,
    CheckCertificationTokenPostRequest,
    CheckCertificationTokenPostResponse
  >(baseURL + '/sms/token', () => {
    return HttpResponse.json({ token: 'token' });
  }),

  // renewalPasswordPatch
  http.patch<NoneType, RenewalPasswordPatchRequest>(
    baseURL + '/new-password',
    () => {
      return HttpResponse.json();
    },
  ),

  //getUserIdPost
  http.post<NoneType, GetUserIdPostRequest, GetUserIdPostResponse>(
    baseURL + '/accountId',
    () => {
      return HttpResponse.json({
        accountId: 'guide_run_project',
        createdAt: '0000-00-00',
      });
    },
  ),

  //withdrawDelete
  http.delete<NoneType, { data: WithdrawDeleteRequest }>(
    baseURL + '/withdrawal',
    () => {
      return HttpResponse.json({});
    },
  ),
];
