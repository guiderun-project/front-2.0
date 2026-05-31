import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <AppWrapper>
      <MobileViewport>
        <Outlet />
      </MobileViewport>
    </AppWrapper>
  );
};

export default App;

const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  justify-content: center;
  background: var(--page-layout-background, ${({ theme }) => theme.color.bg.subtle});
`;

const MobileViewport = styled.div`
  --app-mobile-viewport-width: ${({ theme }) => theme.pxToRem(430)};

  width: 100%;
  max-width: var(--app-mobile-viewport-width);
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  background: ${({ theme }) => theme.color.bg.default};
`;
