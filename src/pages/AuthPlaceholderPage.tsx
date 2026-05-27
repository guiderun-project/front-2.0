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
  gap: ${({ theme }) => theme.spacing.xl};
  padding: 28px;
  border-radius: 32px;
  background: ${({ theme }) => theme.color.bg.elevated};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 0 18px 50px ${({ theme }) => theme.color.bg.weak};
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
`;

const Copy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text.secondary};
  max-width: 56ch;
`;

const RouteChip = styled.code`
  display: inline-flex;
  width: fit-content;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.bg.weak};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: 0.92rem;
`;
