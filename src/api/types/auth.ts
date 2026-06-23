import type {
  DisabilityType,
  Gender,
  RoleEnum,
  RunningGroup,
} from '@/api/types/common';

export type KakaoOAuthLoginQuery = {
  code: string;
};

export type KakaoOAuthLoginResponse =
  | {
      status: 'LOGIN_SUCCESS';
      accessToken: string;
      user: {
        userId: string;
        role: RoleEnum;
        disabilityType: DisabilityType;
      };
    }
  | {
      status: 'SIGNUP_REQUIRED';
      signupToken: string;
      provider: 'KAKAO';
    };

export type LoginPostRequest = {
  accountId: string;
  password: string;
};

export type LoginPostResponse = {
  accessToken: string;
};

export type AccessTokenReissuePostResponse = {
  accessToken: string;
};

export type AccessTokenReissueErrorResponse = {
  code: string;
  message: string;
};

export type SignupCommonInfo = {
  name: string;
  gender: Gender;
  birthDate: string;
  phoneNumber: string;
  snsId: string | null;
  privacy: true;
  portraitRights: true;
};

export type ViSignupInfo = {
  hasRunningExperience: boolean;
  runningGroup: RunningGroup;
  detailRecord: string | null;
  hopePrefs: string | null;
};

export type GuideSignupInfo = {
  id1365?: string | null;
  hasGuideExperience: boolean;
  partneredViName?: string | null;
  runningGroup: RunningGroup;
  detailRecord: string | null;
  hopePrefs: string | null;
};

export type SignupPostRequest =
  | {
      disabilityType: 'VI';
      common: SignupCommonInfo;
      vi: ViSignupInfo;
    }
  | {
      disabilityType: 'GUIDE';
      common: SignupCommonInfo;
      guide: GuideSignupInfo;
    };

export type SignupPostInput = {
  signupToken: string;
  body: SignupPostRequest;
};

export type SignupPostResponse = {
  userId: string;
  accessToken: string;
  role: 'ROLE_WAIT';
  disabilityType: DisabilityType;
};

export type AccountIdVerificationIssueRequest = {
  phoneNum: string;
};

export type PasswordVerificationIssueRequest = {
  accountId: string;
  phoneNum: string;
};

export type SmsVerificationIssueResponse = {
  verificationId: string;
  purpose: 'ACCOUNT_ID' | 'PASSWORD';
  expiresInSeconds: number;
  expiresAt: string;
  serverTime: string;
  canExtend: boolean;
};

export type CheckCertificationTokenPostRequest = {
  verificationId: string;
  number: string;
};

export type CheckCertificationTokenPostResponse = {
  token: string;
  purpose: 'ACCOUNT_ID' | 'PASSWORD';
};

export type SmsVerificationExtendRequest = {
  verificationId: string;
};

export type SmsVerificationExtendResponse = {
  verificationId: string;
  expiresInSeconds: number;
  expiresAt: string;
  serverTime: string;
  canExtend: boolean;
};

export type GetUserIdPostRequest = {
  token: string;
};

export type GetUserIdPostResponse = {
  accountId: string;
  createdAt: string;
};

export type RenewalPasswordPatchRequest = {
  token: string;
  newPassword: string;
};
