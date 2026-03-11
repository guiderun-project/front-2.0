import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';

export const AuthPlaceholderPage = () => {
  const { pathname } = useLocation();

  return (
    <Panel>
      <Title>Auth space is reserved.</Title>
      <Copy>
        The authentication namespace is live, but the actual login, signup,
        and OAuth screens can now be rebuilt without carrying over the old page
        tree.
      </Copy>
      <RouteChip>{pathname}</RouteChip>
    </Panel>
  );
};

const Panel = styled.section`
  display: grid;
  gap: 16px;
  padding: 28px;
  border-radius: 32px;
  background: linear-gradient(180deg, rgba(255, 250, 240, 0.94), rgba(240, 244, 237, 0.95));
  border: 1px solid rgba(21, 32, 33, 0.08);
  box-shadow: 0 18px 50px rgba(18, 31, 28, 0.07);
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
`;

const Copy = styled.p`
  margin: 0;
  color: #465047;
  max-width: 56ch;
`;

const RouteChip = styled.code`
  display: inline-flex;
  width: fit-content;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(21, 32, 33, 0.08);
  color: #152021;
  font-size: 0.92rem;
`;
