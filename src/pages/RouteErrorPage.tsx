import styled from '@emotion/styled';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

const getMessage = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected routing error occurred.';
};

export const RouteErrorPage = () => {
  const error = useRouteError();

  return (
    <Wrapper>
      <Card>
        <Title>Routing error</Title>
        <Copy>{getMessage(error)}</Copy>
        <BackLink to="/">Return home</BackLink>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  gap: 14px;
  min-height: 100vh;
  place-content: center;
  padding: 32px;
`;

const Card = styled.div`
  display: grid;
  gap: 10px;
  width: min(520px, 100%);
  padding: 28px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(21, 32, 33, 0.08);
  box-shadow: 0 18px 60px rgba(18, 31, 28, 0.08);
`;

const Title = styled.h2`
  margin: 0;
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
