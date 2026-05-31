import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

import { BottomNavigation, BOTTOM_NAVIGATION_OFFSET_PX } from '@/components';

export const BottomNavigationLayout = (): ReactElement => {
  return (
    <BottomNavigationLayoutRoot>
      <Outlet />
      <BottomNavigation />
    </BottomNavigationLayoutRoot>
  );
};

const BottomNavigationLayoutRoot = styled.div`
  --bottom-navigation-bottom-offset: max(
    ${({ theme }) => theme.spacing.md},
    env(safe-area-inset-bottom)
  );
  --app-fixed-bottom-offset: calc(
    ${({ theme }) => theme.pxToRem(BOTTOM_NAVIGATION_OFFSET_PX)} +
      var(--bottom-navigation-bottom-offset) - env(safe-area-inset-bottom)
  );

  min-height: 100vh;
  min-height: 100dvh;
`;
