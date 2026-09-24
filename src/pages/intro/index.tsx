import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { ANALYTICS_EVENT, trackEvent } from '@/api/core';
import { api } from '@/api/services';
import {
  Button,
  Graphic,
  HiddenText,
  Icon,
  PageLayout,
  Text,
} from '@/components';
import { useAuth } from '@/contexts';
import { useCheckWebview } from '@/hooks/useCheckWebview';
import { APP_PATH } from '@/router/path';
import type { ReturnLocation } from '@/router/returnPath';
import { saveReturnPath } from '@/router/returnPath';

import { KakaoLoginButton } from './components/KakaoLoginButton';
import { AppleLoginButton } from './components/AppleLoginButton';

const GUIDERUN_LANDING_URL = 'https://about.guiderun.org/';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

type IntroLocationState = {
  from?: ReturnLocation;
  srAnnouncement?: string;
};

export const IntroPage = (): ReactElement => {
  const [applePending, setApplePending] = useState(false);
  const [appleError, setAppleError] = useState('');
  const { isWebview } = useCheckWebview();
  const isLocalhost =
    typeof window !== 'undefined' && LOCAL_HOSTNAMES.has(window.location.hostname);
  const isAppleLoginVisible = isWebview || isLocalhost;
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthReady || isAuthenticated) {
      return;
    }

    const from = (location.state as IntroLocationState | null)?.from;

    if (!from) {
      return;
    }

    saveReturnPath(from);
  }, [isAuthReady, isAuthenticated, location.state]);

  const handleKakaoLogin = () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_KAKAO_REST_API_KEY ?? '',
      redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI ?? '',
      response_type: 'code',
    });

    trackEvent(ANALYTICS_EVENT.INTRO_CTA_CLICKED, { variant: 'kakao' });

    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  };

  const handleAppleLogin = async () => {
    if (applePending) return;
    setApplePending(true);
    setAppleError('');
    try {
      const toBase64Url = (bytes: Uint8Array) =>
        btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const verifier = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
      const challenge = toBase64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
      // This is a short-lived browser binding, never an access/refresh token.
      sessionStorage.setItem('apple-login-verifier', verifier);
      const { authorizationUrl } = await api.auth.appleOAuthStartPost({ challenge });
      trackEvent(ANALYTICS_EVENT.INTRO_CTA_CLICKED, { variant: 'apple' });
      window.location.assign(authorizationUrl);
    } catch {
      sessionStorage.removeItem('apple-login-verifier');
      setAppleError('Apple 로그인을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.');
      setApplePending(false);
    }
  };

  const handleIdLogin = () => {
    trackEvent(ANALYTICS_EVENT.INTRO_CTA_CLICKED, { variant: 'id' });
    navigate(APP_PATH.LOGIN);
  };

  const handleBrowseClick = () => {
    trackEvent(ANALYTICS_EVENT.INTRO_CTA_CLICKED, { variant: 'browse' });
  };

  return (
    <PageLayout background="bg.subtle" gradient="gradient.bg.brand-main">
      <Content>
        <TitleSection>
          <Text align="center" as="h1" font="heading-m-sb">
            함께 연결된 안전한 러닝
          </Text>
          <Text align="center" color="text.tertiary" font="body-m-m">
            첫 방문이라면,
            <br />
            {isWebview
              ? '카카오 또는 Apple 계정으로 가입해 주세요'
              : '카카오 계정으로 가입해 주세요'}
          </Text>
        </TitleSection>

        <Illustration aria-hidden={true} color="icon.primary" graphic="welcome" />

        <GuideRunInfoSection>
          <GuideRunInfoLink
            href={GUIDERUN_LANDING_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Text align="center" color="text.primary" font="body-s-sb">
              가이드런 알아보기
              <HiddenText>새창 열림</HiddenText>
            </Text>
            <Icon
              aria-hidden={true}
              color="text.primary"
              icon="external-link-lined"
              size={16}
            />
          </GuideRunInfoLink>
        </GuideRunInfoSection>

        <ActionSection>
          <BrowseLink to={APP_PATH.HOME} onClick={handleBrowseClick}>
            <Text color="text.brand" font="body-m-sb">
              가입없이 둘러보기
            </Text>
          </BrowseLink>

          <LoginButtonGroup>
            <KakaoLoginButton onClick={handleKakaoLogin} />
            {isAppleLoginVisible && (
              <>
                <AppleLoginButton
                  disabled={applePending}
                  onClick={() => {
                    void handleAppleLogin();
                  }}
                />
                {appleError && (
                  <Text align="center" font="body-s-sb" role="alert">
                    {appleError}
                  </Text>
                )}
              </>
            )}
            <Button
              fullWidth
              level="line-type"
              size="l"
              onClick={handleIdLogin}
            >
              아이디로 로그인
            </Button>
          </LoginButtonGroup>
        </ActionSection>
      </Content>
    </PageLayout>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const TitleSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) =>
    `${theme.spacing['6xl']} ${theme.spacing['2xl']} ${theme.spacing['4xl']}`};
`;

const Illustration = styled(Graphic)`
  align-self: center;
`;

const GuideRunInfoSection = styled.section`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing['2xl']}`};
`;

const GuideRunInfoLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing['3xl']}`};
  border: ${({ theme }) => theme.pxToRem(1.4)} solid
    ${({ theme }) => theme.color.border.strong};
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme }) => theme.color.bg.subtle};
  cursor: pointer;
  appearance: none;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }
`;

const ActionSection = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.pxToRem(18)};
  padding: ${({ theme }) =>
    `${theme.spacing.xl} ${theme.spacing['2xl']} ${theme.spacing.xl}`};
`;

const BrowseLink = styled(Link)`
  display: inline-block;
  padding: ${({ theme }) => `${theme.pxToRem(3)} 0`};
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.text.brand};
  background-color: transparent;
  cursor: pointer;
  appearance: none;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }
`;

const LoginButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;
