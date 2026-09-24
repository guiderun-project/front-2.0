import { useEffect, useRef, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { ANALYTICS_EVENT, getApiErrorMessage, trackEvent } from '@/api/core';
import { api } from '@/api/services';
import { PageLayout, Text } from '@/components';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';
import { peekReturnPath } from '@/router/returnPath';

type Status = 'processing' | 'error';

const OAUTH_ERROR_MESSAGE = '로그인에 실패했어요. 다시 시도해 주세요.';

export const SocialOAuthPage = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { startSession } = useAuth();
  const [status, setStatus] = useState<Status>('processing');
  const [errorMessage, setErrorMessage] = useState(OAUTH_ERROR_MESSAGE);
  const handledRef = useRef(false);

  const isApple = searchParams.get('provider') === 'apple';
  const providerLabel = isApple ? 'Apple' : '카카오';

  const statusMessage =
    status === 'processing' ? `${providerLabel} 로그인 처리 중이에요...` : errorMessage;
  // 라이브 리전은 빈 상태로 먼저 마운트한 뒤 다음 프레임에 메시지를 채워야
  // 처리 중 안내와 실패 전환이 스크린리더에 안정적으로 낭독된다.
  const [announcedMessage, setAnnouncedMessage] = useState('');

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedMessage(statusMessage);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [statusMessage]);

  useEffect(() => {
    // React StrictMode 의 effect 이중 실행 및 인가 코드 재사용 방지
    if (handledRef.current) return;
    handledRef.current = true;

    const code = searchParams.get('code');
    const ticket = new URLSearchParams(window.location.hash.slice(1)).get('ticket');
    const appleError = searchParams.get('error');
    const verifier = isApple ? sessionStorage.getItem('apple-login-verifier') : null;
    if (isApple) {
      sessionStorage.removeItem('apple-login-verifier');
      window.history.replaceState(window.history.state, '', `${window.location.pathname}?provider=apple`);
      if (appleError || !ticket || !verifier) {
        queueMicrotask(() => {
          setErrorMessage(appleError === 'access_denied' ? 'Apple 로그인을 취소했어요.' : OAUTH_ERROR_MESSAGE);
          setStatus('error');
        });
        return;
      }
    }

    if (!isApple && !code) {
      navigate(APP_PATH.INTRO, { replace: true });
      return;
    }

    const handleCallback = async () => {
      try {
        const result = isApple
          ? await api.auth.appleOAuthExchangePost({ ticket: ticket!, verifier: verifier! })
          : await api.auth.kakaoOAuthLoginPost({ code: code! });

        if (result.status === 'SIGNUP_REQUIRED') {
          trackEvent(ANALYTICS_EVENT.SIGNUP_STARTED, {
            provider: result.provider,
          });
          navigate(APP_PATH.SIGNUP, {
            replace: true,
            state: {
              signupToken: result.signupToken,
              provider: result.provider,
            },
          });
          return;
        }

        await startSession(result.accessToken);
        navigate(peekReturnPath() ?? APP_PATH.HOME, { replace: true });
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, OAUTH_ERROR_MESSAGE));
        setStatus('error');
      }
    };

    void handleCallback();
  }, [searchParams, navigate, startSession, isApple]);

  return (
    <PageLayout background="bg.subtle">
      <HiddenHeading>{providerLabel} 로그인</HiddenHeading>
      <Text align="center" color="text.secondary" font="body-m-m" role="status">
        {announcedMessage}
      </Text>
      {status === 'error' && <Link to={APP_PATH.INTRO}>로그인 화면으로 돌아가기</Link>}
    </PageLayout>
  );
};

// HiddenText 공용 컴포넌트는 span 고정이라 헤딩 시맨틱용 h1을 페이지 로컬로 정의
const HiddenHeading = styled.h1({
  // 고정값은 표준 visually-hidden 접근성 패턴을 따른다.
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
