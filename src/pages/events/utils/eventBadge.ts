import type { EventType, RecruitStatus } from '@/api/types';
import type { BadgeTone } from '@/components';

type EventBadgeConfig =
  | {
      label: string;
      variant: 'soft';
      tone: BadgeTone<'soft'>;
    }
  | {
      label: string;
      variant: 'solid';
      tone: BadgeTone<'solid'>;
    };

const EVENT_BADGE_CONFIGS = {
  COMPETITION: {
    label: '대회',
    variant: 'solid',
    tone: 'cyan',
  },
  TRAINING: {
    label: '훈련',
    variant: 'solid',
    tone: 'gray',
  },
  RECRUIT_UPCOMING: {
    label: '모집예정',
    variant: 'soft',
    tone: 'orange',
  },
  RECRUIT_OPEN: {
    label: '모집중',
    variant: 'soft',
    tone: 'cyan2',
  },
  RECRUIT_CLOSE: {
    label: '모집마감',
    variant: 'soft',
    tone: 'gray',
  },
  RECRUIT_END: {
    label: '종료',
    variant: 'soft',
    tone: 'gray',
  },
} as const satisfies Record<
  EventType | RecruitStatus,
  EventBadgeConfig
>;

export const getEventTypeBadgeConfig = (eventType: EventType) => {
  return EVENT_BADGE_CONFIGS[eventType];
};

export const getRecruitStatusBadgeConfig = (recruitStatus: RecruitStatus) => {
  return EVENT_BADGE_CONFIGS[recruitStatus];
};

export type { EventBadgeConfig };
