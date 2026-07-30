import posthog from 'posthog-js';

import type { RoleEnum, UserType } from '@/api/types';

export const POSTHOG_PROJECT_TOKEN = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;

export const isPostHogEnabled = () => {
  return Boolean(POSTHOG_PROJECT_TOKEN);
};

export const ANALYTICS_EVENT = {
  APPROVAL_GATE_BLOCKED: 'approval_gate_blocked',
  INTRO_CTA_CLICKED: 'intro_cta_clicked',
  SIGNUP_COMPLETED: 'signup_completed',
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_COMPLETED_ACTION: 'application_completed_action',
  EVENT_TYPE_SELECTED: 'event_type_selected',
  EVENT_CREATED: 'event_created',
  MATCHING_CREATED: 'matching_created',
  ATTENDANCE_CHECKED: 'attendance_checked',
  ATTENDANCE_CANCELED: 'attendance_canceled',
  ATTENDANCE_LIST_EXPORTED: 'attendance_list_exported',
  APPLICANT_ROW_CLICKED: 'applicant_row_clicked',
  UPCOMING_EVENT_CARD_CLICKED: 'upcoming_event_card_clicked',
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENT)[keyof typeof ANALYTICS_EVENT];

export const trackEvent = (
  event: AnalyticsEventName,
  properties?: Record<string, unknown>,
) => {
  if (!isPostHogEnabled()) {
    return;
  }

  posthog.capture(event, properties);
};

type IdentifiableUser = {
  userId: string;
  role: RoleEnum;
  type: UserType;
};

export const identifyUser = (user: IdentifiableUser) => {
  if (!isPostHogEnabled()) {
    return;
  }

  posthog.identify(user.userId, {
    role: user.role,
    type: user.type,
  });
};

// 등록한 super property 원장. posthog 의 persistence 가 비어 있는 두 시점에 다시 심는다.
// 1) init 이전: PostHogProvider 는 init 을 effect 안에서 실행하는데 React 는 자식 effect 를
//    먼저 돌리므로, 트리 안쪽 프로바이더가 마운트 시점에 등록한 속성은 init 보다 앞선다.
//    init 전 posthog.register 는 persistence 가 없어 조용히 버려진다.
// 2) reset 직후: posthog.reset 은 persistence 를 통째로 비워 super property 도 함께 지운다.
const sessionSuperProperties: Record<string, unknown> = {};
let isPostHogLoaded = false;

export const registerSuperProperties = (
  properties: Record<string, unknown>,
) => {
  if (!isPostHogEnabled()) {
    return;
  }

  Object.assign(sessionSuperProperties, properties);

  if (!isPostHogLoaded) {
    return;
  }

  posthog.register(properties);
};

// posthog init 의 loaded 콜백에서 호출한다. 세션 동안 값이 바뀌지 않는 속성을 등록하고,
// 부팅 중 보류돼 있던 속성을 함께 반영한다.
export const registerSessionProperties = () => {
  isPostHogLoaded = true;

  registerSuperProperties({
    ...sessionSuperProperties,
    // 카카오톡 인앱 브라우저 여부는 세션 동안 바뀌지 않는다.
    isKakaoInApp: /KAKAOTALK/i.test(window.navigator.userAgent),
  });
};

// 로그아웃·탈퇴로 세션을 끝낼 때 호출한다. reset 을 하지 않으면 identify 로 persistence 에
// 고정된 distinct_id 가 남아, 이후 비로그인 활동과 같은 기기에서의 다음 가입까지 직전
// 사용자에게 귀속된다.
export const resetIdentity = () => {
  if (!isPostHogEnabled()) {
    return;
  }

  posthog.reset();
  posthog.register(sessionSuperProperties);
};
