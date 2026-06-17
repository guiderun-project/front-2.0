import type { RecruitStatus } from '@/api/types';
import type { ButtonLevel } from '@/components';

export type EventDetailCtaAction =
  | 'apply'
  | 'cancelApplication'
  | 'editApplication'
  | 'match'
  | 'attendance'
  | 'disabled';

export type EventDetailCtaButtonConfig = {
  action: EventDetailCtaAction;
  label: string;
  level?: ButtonLevel;
  disabled?: boolean;
};

type EventDetailCtaParams = {
  canManageEvent: boolean;
  isApplied: boolean;
  recruitStatus: RecruitStatus;
};

const EVENT_UPCOMING_DISABLED_BUTTON = {
  action: 'disabled',
  disabled: true,
  label: '이벤트가 곧 열릴 예정이에요',
} satisfies EventDetailCtaButtonConfig;

export const getEventDetailCtaButtonConfigs = ({
  canManageEvent,
  isApplied,
  recruitStatus,
}: EventDetailCtaParams): EventDetailCtaButtonConfig[] => {
  if (canManageEvent) {
    return getManagementCtaButtonConfigs(recruitStatus);
  }

  return getParticipantCtaButtonConfigs({ isApplied, recruitStatus });
};

const getManagementCtaButtonConfigs = (
  recruitStatus: RecruitStatus,
): EventDetailCtaButtonConfig[] => {
  switch (recruitStatus) {
    case 'RECRUIT_OPEN':
      return [{ action: 'match', label: '매칭하기' }];
    case 'RECRUIT_CLOSE':
    case 'RECRUIT_END':
      return [
        {
          action: 'match',
          label: '매칭수정',
          level: 'secondary',
        },
        {
          action: 'attendance',
          label: '출석하기',
        },
      ];
    case 'RECRUIT_UPCOMING':
      return [EVENT_UPCOMING_DISABLED_BUTTON];
  }
};

const getParticipantCtaButtonConfigs = ({
  isApplied,
  recruitStatus,
}: Omit<EventDetailCtaParams, 'canManageEvent'>): EventDetailCtaButtonConfig[] => {
  switch (recruitStatus) {
    case 'RECRUIT_OPEN':
      if (isApplied) {
        return [
          {
            action: 'cancelApplication',
            label: '신청취소',
            level: 'secondary',
          },
          {
            action: 'editApplication',
            label: '신청서 수정하기',
          },
        ];
      }

      return [{ action: 'apply', label: '참여 신청하기' }];
    case 'RECRUIT_CLOSE':
      return [
        {
          action: 'disabled',
          disabled: true,
          label: '현재 참여신청이 불가해요',
        },
      ];
    case 'RECRUIT_UPCOMING':
      return [EVENT_UPCOMING_DISABLED_BUTTON];
    case 'RECRUIT_END':
      return [
        {
          action: 'disabled',
          disabled: true,
          label: '이벤트 신청이 마감되었어요',
        },
      ];
  }
};
