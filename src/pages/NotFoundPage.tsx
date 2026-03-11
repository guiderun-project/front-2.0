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
  padding: 32px 28px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(21, 32, 33, 0.08);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 2rem;
`;

const Copy = styled.p`
  margin: 0;
  color: #4c544d;
`;

const BackLink = styled(Link)`
  width: fit-content;
  padding: 10px 16px;
  border-radius: 999px;
  background: #152021;
  color: #f8f4ea;
`;
