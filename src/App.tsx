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
  padding: 32px;
`;

const Frame = styled.div`
  display: grid;
  gap: 24px;
  width: min(1180px, 100%);
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  border: 1px solid rgba(21, 32, 33, 0.1);
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(252, 247, 238, 0.94), rgba(255, 255, 255, 0.9)),
    rgba(255, 255, 255, 0.85);
  box-shadow: 0 18px 60px rgba(18, 31, 28, 0.08);
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
  color: #5b5f4c;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.4rem, 2vw, 2rem);
  line-height: 1;
`;

const Nav = styled.nav`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const NavItem = styled(NavLink)`
  padding: 10px 16px;
  border-radius: 999px;
  color: #1f2620;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid transparent;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(21, 32, 33, 0.14);
  }

  &.active {
    background: #152021;
    color: #f8f4ea;
  }
`;

const Content = styled.main`
  display: grid;
`;
