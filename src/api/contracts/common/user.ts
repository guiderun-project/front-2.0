import { DisabilityEnum, GenderEnum, RoleEnum, RunningGroup } from './group';

export interface UserType {
  userId: string;
  name: string;
  img: string;
  type: DisabilityEnum;
  role: RoleEnum;
  gender: GenderEnum;
  phoneNumber: string;
  recordDegree: RunningGroup;
  age: number;
  snsId: string;
  isOpenNumber: boolean;
  isOpenSns: boolean;
  detailRecord: string;

  runningPlace: string;
  howToKnow: string[];
  motive: string;
  hopePrefs: string;

  privacy: boolean;
  portraitRights: boolean;

  isLiked: boolean;
  like: number;

  trainingCnt?: number;
  contestCnt?: number;

  id1365?: string;
  birth?: string;
}

export interface ViType extends UserType {
  isRunningExp: boolean;
  guideName?: string;
}

export interface GuideType extends UserType {
  isGuideExp: boolean;
  viName: string;
  viRecord?: string; //vi 러닝 기록
  viCount?: string; //상세한 가이드 경험 *선택
  guidingPace: RunningGroup; //가이드 가능한 페이스
}
