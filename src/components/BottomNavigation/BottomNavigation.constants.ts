import { APP_PATH } from '@/router/path';

import type { IconName } from '../Icon';

export const BOTTOM_NAVIGATION_OFFSET_PX = 64;
export const BOTTOM_NAVIGATION_ARIA_LABEL = '하단 메뉴';

type BottomNavigationItem = {
  label: string;
  to: string;
  end: boolean;
  activeIcon: IconName;
  inactiveIcon: IconName;
};

// TODO: Confirm these destination endpoints once the route contract is finalized.
export const BOTTOM_NAVIGATION_ITEMS = [
  {
    label: '전체 모임',
    to: APP_PATH.EVENT,
    end: false,
    activeIcon: 'list-filled',
    inactiveIcon: 'list-lined',
  },
  {
    label: '홈화면',
    to: APP_PATH.HOME,
    end: true,
    activeIcon: 'home-filled',
    inactiveIcon: 'home-lined',
  },
  {
    label: '마이페이지',
    to: APP_PATH.MY,
    end: false,
    activeIcon: 'user-filled',
    inactiveIcon: 'user-lined',
  },
] as const satisfies readonly BottomNavigationItem[];
