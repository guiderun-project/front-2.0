import { GuideType, UserType, ViType } from '@/api/contracts/common/user';

export type KakaoAuthPostRequest = {
  code: string;
};

export type KakaoAuthPostResponse = {
  accessToken: string;
  //false: new user
  //true: go to main
  isExist: boolean;
};

type AccountType = {
  accountId: string;
  password: string;
};

export type ViSignupPostRequest = Pick<
  ViType,
  | 'name'
  | 'gender'
  | 'phoneNumber'
  | 'isOpenNumber'
  | 'age'
  | 'recordDegree'
  | 'detailRecord'
  | 'snsId'
  | 'isOpenSns'
  | 'isRunningExp'
  | 'guideName'
  | 'runningPlace'
  | 'howToKnow'
  | 'motive'
  | 'hopePrefs'
  | 'privacy'
  | 'portraitRights'
  | 'id1365'
> &
  AccountType;

export type GuideSignupPostRequest = Pick<
  GuideType,
  | 'name'
  | 'gender'
  | 'phoneNumber'
  | 'isOpenNumber'
  | 'age'
  | 'recordDegree'
  | 'detailRecord'
  | 'snsId'
  | 'isOpenSns'
  | 'runningPlace'
  | 'isGuideExp'
  | 'viName'
  | 'viRecord'
  | 'viCount'
  | 'guidingPace'
  | 'howToKnow'
  | 'motive'
  | 'hopePrefs'
  | 'privacy'
  | 'portraitRights'
  | 'id1365'
  | 'birth'
> &
  AccountType;

export type SignupPostResponse = {
  userId: UserType['userId'];
  accessToken: string;
  role: UserType['role'];
};

export type AccessTokenGetResponse = {
  accessToken: string;
  isExist: boolean;
};

export type CheckDuplicatedPostRequest = {
  accountId: AccountType['accountId'];
};

export type CheckDuplicatedPostResponse = {
  isUnique: boolean;
};

export type LoginPostRequest = AccountType;

export type LoginPostResponse = {
  accessToken: string;
  isExist: boolean;
};

export type GetCertificationTokenPasswordPostRequest = {
  accountId: AccountType['accountId'];
  phoneNum: string;
};

export type CheckCertificationTokenPostRequest = {
  number: string;
};

export type CheckCertificationTokenPostResponse = {
  token: string;
};

export type GetCertificationTokenIdPostRequest = {
  phoneNum: string;
};

export type RenewalPasswordPatchRequest = {
  token: string;
  newPassword: string;
};

export type GetUserIdPostRequest = {
  token: string;
};

export type GetUserIdPostResponse = {
  accountId: AccountType['accountId'];
  createdAt: string;
};

export type WithdrawDeleteRequest = {
  reasons: string[];
};
