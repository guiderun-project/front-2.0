import { Event } from '@/api/contracts/common/event';
import { RecruitStatus } from '@/api/contracts/common/group';
import { PartnerSort } from '@/api/contracts/common/sort';
import { GuideType, UserType, ViType } from '@/api/contracts/common/user';

export type MyPageGetResponse = {
  role: UserType['role'];
  type: UserType['type'];
  gender: UserType['gender'];
  recordDegree: UserType['recordDegree'];
  name: UserType['name'];

  totalEvent: number;
  trainingCnt: number;
  contestCnt: number;
};

export type UserInfoGetResponse = Pick<
  UserType,
  | 'userId'
  | 'name'
  | 'type'
  | 'role'
  | 'gender'
  | 'phoneNumber'
  | 'recordDegree'
  | 'age'
  | 'snsId'
  | 'img'
  | 'id1365'
>;

export type PersonalInfoGetRequest = Pick<UserType, 'userId'>;

export type PersonalInfoGetResponse = Pick<
  UserType,
  | 'name'
  | 'type'
  | 'role'
  | 'gender'
  | 'phoneNumber'
  | 'age'
  | 'snsId'
  | 'isOpenNumber'
  | 'isOpenSns'
  | 'id1365'
  | 'birth'
>;

export type PersonalInfoPatchRequest = Omit<
  PersonalInfoGetResponse,
  'type' | 'role'
>;

export type PersonalInfoPatchResponse = Omit<
  PersonalInfoGetResponse,
  'userId' | 'img'
>;

export type RunningSpecGuideGetRequest = Pick<UserType, 'userId'>;

export type RunningSpecGuideGetResponse = Pick<
  GuideType,
  | 'recordDegree'
  | 'detailRecord'
  | 'isGuideExp'
  | 'runningPlace'
  | 'viName'
  | 'viRecord'
  | 'viCount'
  | 'howToKnow'
  | 'motive'
  | 'guidingPace'
  | 'hopePrefs'
>;

export type RunningSpecGuidePatchRequest = RunningSpecGuideGetResponse;

export type RunningSpecGuidePatchResponse = RunningSpecGuideGetResponse;

export type RunningSpecViGetRequest = Pick<UserType, 'userId'>;

export type RunningSpecViGetResponse = Pick<
  ViType,
  | 'isRunningExp'
  | 'recordDegree'
  | 'detailRecord'
  | 'runningPlace'
  | 'guideName'
  | 'howToKnow'
  | 'motive'
  | 'hopePrefs'
>;

export type RunningSpecViPatchRequest = RunningSpecViGetResponse;

export type RunningSpecViPatchResponse = RunningSpecViGetResponse;

export type PermissionGetRequest = Pick<UserType, 'userId'>;

export type PermissionGetResponse = Pick<
  UserType,
  'privacy' | 'portraitRights'
>;

export type PermissionPatchRequest = PermissionGetResponse;

export type PermissionPatchResponse = PermissionGetResponse;

export type UserProfileGetRequest = Pick<UserType, 'userId'>;

export type UserProfileGetResponse = Pick<
  UserType,
  | 'userId'
  | 'name'
  | 'role'
  | 'type'
  | 'gender'
  | 'recordDegree'
  | 'detailRecord'
  | 'phoneNumber'
  | 'isOpenNumber'
  | 'age'
  | 'snsId'
  | 'isOpenSns'
  | 'img'
  | 'isLiked'
  | 'like'
  | 'id1365'
>;

export type PartnerListGetRequest = {
  userId: UserType['userId'];
  sort?: PartnerSort;
  limit?: number;
  start?: number;
};

export type PartnerDataType = Pick<
  UserType,
  | 'userId'
  | 'img'
  | 'role'
  | 'type'
  | 'name'
  | 'recordDegree'
  | 'trainingCnt'
  | 'contestCnt'
  | 'like'
  | 'isLiked'
>;

export type PartnerListGetResponse = {
  sort: PartnerSort;
  limit: number;
  start: number;
  items: PartnerDataType[];
};

export type PartnerListCountGetRequest = Pick<UserType, 'userId'>;

export type PartnerListCountGetResponse = {
  count: number;
};

export type EventHistoryGetRequest = {
  userId: UserType['userId'];
  sort?: RecruitStatus;
  limit?: number;
  start?: number;
  year?: number;
};

export type EventDataType = {
  eventId: Event['eventId'];
  eventType: Event['type'];
  name: Event['name'];
  recruitStatus: Event['recruitStatus'];
  startDate: string;
};

export type EventHistoryGetResponse = {
  items: EventDataType[];
};

export type EventHistoryCountGetRequest = {
  userId: UserType['userId'];
  year?: number;
  sort?: RecruitStatus;
};

export type EventHistoryCountGetResponse = {
  count: number;
};

export type ProfileImagePostRequest = {
  image: FormData;
};

export type ProfileImagePostResponse = {
  img: UserType['img'];
};

export type LikePostRequest = Pick<UserType, 'userId'>;

export type UserInfoAllGetResponse = {
  guideInfo: Pick<
    GuideType,
    | 'name'
    | 'type'
    | 'role'
    | 'gender'
    | 'phoneNumber'
    | 'recordDegree'
    | 'age'
    | 'snsId'
    | 'isOpenNumber'
    | 'isOpenSns'
    | 'detailRecord'
    | 'isGuideExp'
    | 'viName'
    | 'viRecord'
    | 'viCount'
    | 'guidingPace'
    | 'runningPlace'
    | 'howToKnow'
    | 'motive'
    | 'hopePrefs'
    | 'privacy'
    | 'portraitRights'
  >[];
  viInfo: Pick<
    ViType,
    | 'name'
    | 'type'
    | 'role'
    | 'gender'
    | 'phoneNumber'
    | 'recordDegree'
    | 'age'
    | 'snsId'
    | 'isOpenNumber'
    | 'isOpenSns'
    | 'detailRecord'
    | 'isRunningExp'
    | 'guideName'
    | 'runningPlace'
    | 'howToKnow'
    | 'motive'
    | 'hopePrefs'
    | 'privacy'
    | 'portraitRights'
  >[];
};

export type UserPersonal1365IdPostRequest = Pick<UserType, 'id1365'>;
