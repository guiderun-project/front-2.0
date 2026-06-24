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
  isEventDateStarted: boolean;
  isApplied: boolean;
  recruitStatus: RecruitStatus;
};

const EVENT_UPCOMING_DISABLED_BUTTON = {
  action: 'disabled',
  disabled: true,
  label: '이벤트가 곧 열릴 예정이에요',
} satisfies EventDetailCtaButtonConfig;

const EVENT_DATE_STARTED_MANAGEMENT_BUTTONS = [
  {
    action: 'match',
    label: '매칭수정',
    level: 'secondary',
  },
  {
    action: 'attendance',
    label: '출석하기',
  },
] satisfies EventDetailCtaButtonConfig[];

export const getEventDetailCtaButtonConfigs = ({
  canManageEvent,
  isEventDateStarted,
  isApplied,
  recruitStatus,
}: EventDetailCtaParams): EventDetailCtaButtonConfig[] => {
  if (canManageEvent) {
    return getManagementCtaButtonConfigs({
      isEventDateStarted,
      recruitStatus,
    });
  }

  return getParticipantCtaButtonConfigs({ isApplied, recruitStatus });
};

type ManagementCtaParams = Pick<
  EventDetailCtaParams,
  'isEventDateStarted' | 'recruitStatus'
>;

const getManagementCtaButtonConfigs = ({
  isEventDateStarted,
  recruitStatus,
}: ManagementCtaParams): EventDetailCtaButtonConfig[] => {
  if (isEventDateStarted) {
    return EVENT_DATE_STARTED_MANAGEMENT_BUTTONS;
  }

  switch (recruitStatus) {
    case 'RECRUIT_OPEN':
      return [{ action: 'match', label: '매칭하기' }];
    case 'RECRUIT_CLOSE':
    case 'RECRUIT_END':
      return EVENT_DATE_STARTED_MANAGEMENT_BUTTONS;
    case 'RECRUIT_UPCOMING':
      return [EVENT_UPCOMING_DISABLED_BUTTON];
  }
};

const EVENT_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const getEventDateStartTimestamp = (eventDate: string): number | null => {
  const match = EVENT_DATE_PATTERN.exec(eventDate);

  if (!match) {
    return null;
  }

  const [, year, month, date] = match;
  const eventDateStart = new Date(
    Number(year),
    Number(month) - 1,
    Number(date),
    0,
    0,
    0,
    0,
  );

  return eventDateStart.getTime();
};

export const hasEventDateStarted = (
  eventDate: string,
  currentTime: number,
): boolean => {
  const eventDateStartTimestamp = getEventDateStartTimestamp(eventDate);

  return (
    eventDateStartTimestamp !== null &&
    currentTime >= eventDateStartTimestamp
  );
};

const getParticipantCtaButtonConfigs = ({
  isApplied,
  recruitStatus,
}: Omit<
  EventDetailCtaParams,
  'canManageEvent' | 'isEventDateStarted'
>): EventDetailCtaButtonConfig[] => {
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
