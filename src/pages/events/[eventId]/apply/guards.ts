import type { EventDetailResponse, UserInfoGetResponse } from '@/api/types';
import { USER_ROLES } from '@/constants/roles';

export const getEventApplyIneligibleMessage = (
  event: EventDetailResponse,
  user: UserInfoGetResponse,
): string | null => {
  if (event.recruitStatus !== 'RECRUIT_OPEN') {
    return '현재 모집 중인 이벤트만 신청할 수 있어요.';
  }

  if (event.viewer?.isOrganizer === true || user.role === USER_ROLES.ADMIN) {
    return '주최자와 관리자는 참여 신청을 진행할 수 없어요.';
  }

  return null;
};

export const getEventApplyProfileMissingMessage = (
  event: EventDetailResponse,
  user: UserInfoGetResponse,
): string | null => {
  if (
    event.eventType === 'COMPETITION' &&
    (!user.birthDate || !user.phoneNumber)
  ) {
    return '대회 신청에 필요한 생년월일/전화번호 정보가 없어요. 내 정보에서 프로필을 먼저 등록해주세요.';
  }

  return null;
};
