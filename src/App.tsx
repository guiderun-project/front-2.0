import styled from '@emotion/styled';
import { NavLink, Outlet } from 'react-router-dom';

import { APP_PATH } from '@/router/path';

const App = () => {
  return (
    <Shell>
      <Frame>
        <Header>
          <Brand>
            <Eyebrow>GuideRun</Eyebrow>
            <Title>Front v2 foundation</Title>
          </Brand>
          <Nav aria-label="Primary">
            <NavItem end to={APP_PATH.HOME}>
              Home
            </NavItem>
            <NavItem to={APP_PATH.AUTH}>
              Auth
            </NavItem>
          </Nav>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Frame>
    </Shell>
  );
};

export default App;

const Shell = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing['4xl']};
`;

const Frame = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing['3xl']};
  width: min(1180px, 100%);
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing['3xl']};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 28px;
  background: ${({ theme }) => theme.color.bg.elevated};
  box-shadow: 0 18px 60px ${({ theme }) => theme.color.bg.weak};
  backdrop-filter: blur(18px);
`;

const Brand = styled.div`
  display: grid;
  gap: 6px;
`;

const Eyebrow = styled.span`
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.text.tertiary};
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.4rem, 2vw, 2rem);
  line-height: 1;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const NavItem = styled(NavLink)`
  padding: 10px ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.color.text.primary};
  background: ${({ theme }) => theme.color.bg.elevated};
  border: 1px solid transparent;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.color.border.default};
  }

  &.active {
    background: ${({ theme }) => theme.color.bg.inverse};
    color: ${({ theme }) => theme.color.text.inverse};
  }
`;

const Content = styled.main`
  display: grid;
`;
