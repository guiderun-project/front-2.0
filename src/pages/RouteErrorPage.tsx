import { useEffect, useRef } from 'react';

import styled from '@emotion/styled';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

import { captureRouteError, getApiErrorMessage } from '@/api/core';
import { PageTitle } from '@/components';

const getMessage = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return getApiErrorMessage(error, error.message);
  }

  return 'An unexpected routing error occurred.';
};

export const RouteErrorPage = () => {
  const error = useRouteError();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    captureRouteError(error);
  }, [error]);

  // errorElement는 앱 트리 전체를 교체해 포커스가 body로 떨어지고 스크린리더에
  // 아무 안내도 없으므로, 오류 제목으로 포커스를 옮겨 오류 발생을 즉시 낭독시킨다.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <>
      <PageTitle title="페이지 오류" />
      <Wrapper>
        <Card>
          {/* lang="en": 항상 영어인 텍스트만 영어 TTS로 낭독되도록 표시.
              Copy(getMessage)는 한국어 API 메시지일 수 있어 지정하지 않는다. */}
          <Title lang="en" ref={titleRef} tabIndex={-1}>
            Routing error
          </Title>
          <Copy>{getMessage(error)}</Copy>
          <BackLink lang="en" to="/">
            Return home
          </BackLink>
        </Card>
      </Wrapper>
    </>
  );
};

/* main 랜드마크: 이름 없는 section은 스크린리더 랜드마크 탐색에 나타나지 않는다.
   두 요소 모두 기본 display 동작이 같아 시각 변화는 없다. */
const Wrapper = styled.main`
  display: grid;
  gap: 14px;
  min-height: 100vh;
  place-content: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
`;

const Card = styled.div`
  display: grid;
  gap: 10px;
  width: min(520px, 100%);
  padding: 28px;
  border-radius: 28px;
  background: ${({ theme }) => theme.color.bg.elevated};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 0 18px 60px ${({ theme }) => theme.color.bg.overlay};
`;

/* h1 승격은 스크린리더 문서 구조(제목 레벨 1)용.
   font-size/font-weight는 기존 h2 UA 기본값과 동일하게 명시해 시각 결과를 유지한다. */
const Title = styled.h1`
  margin: 0;
  font-size: 1.5em;
  font-weight: 700;
`;

const Copy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text.secondary};
`;

const BackLink = styled(Link)`
  width: fit-content;
  padding: 10px ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.text.primary};
  color: ${({ theme }) => theme.color.text.inverse};
`;
