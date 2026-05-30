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
  --app-fixed-bottom-offset: ${({ theme }) => theme.pxToRem(BOTTOM_NAVIGATION_OFFSET_PX)};

  min-height: 100vh;
  min-height: 100dvh;
`;
