import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <Wrapper>
      <Title>Route not found</Title>
      <Copy>The v2 shell only exposes the root and auth namespaces for now.</Copy>
      <BackLink to="/">Return home</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  gap: 14px;
  padding: ${({ theme }) => theme.spacing['4xl']} 28px;
  border-radius: 32px;
  background: ${({ theme }) => theme.color.bg.elevated};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 2rem;
`;

const Copy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text.secondary};
`;

const BackLink = styled(Link)`
  width: fit-content;
  padding: 10px ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.bg.inverse};
  color: ${({ theme }) => theme.color.text.inverse};
`;
