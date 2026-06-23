import type { ReactElement } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { Button, Graphic, Icon, PageLayout, Text } from '@/components';
import { APP_PATH } from '@/router/path';

import { KakaoLoginButton } from './components/KakaoLoginButton';

const GUIDERUN_LANDING_URL = 'https://about.guiderun.org/';

export const IntroPage = (): ReactElement => {
  const navigate = useNavigate();

  const handleGuideRunInfoClick = () => {
    window.open(GUIDERUN_LANDING_URL, '_blank', 'noopener,noreferrer');
  };

  const handleBrowseWithoutSignup = () => {
    navigate(APP_PATH.HOME);
  };

  const handleKakaoLogin = () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_KAKAO_REST_API_KEY ?? '',
      redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI ?? '',
      response_type: 'code',
    });

    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  };

  const handleIdLogin = () => {
    navigate(APP_PATH.LOGIN);
  };

  return (
    <PageLayout background="gradient.bg.brand-main">
      <Content>
        <TitleSection>
          <Text align="center" as="h1" font="heading-m-sb">
            함께 연결된 안전한 러닝
          </Text>
          <Text align="center" color="text.tertiary" font="body-m-m">
            첫 방문이라면,
            <br />
            먼저 카카오톡 회원가입이 필요해요
          </Text>
        </TitleSection>

        <Illustration aria-hidden={true} color="icon.primary" graphic="welcome" />

        <GuideRunInfoSection>
          <GuideRunInfoButton type="button" onClick={handleGuideRunInfoClick}>
            <Text align="center" color="text.tertiary" font="body-s-sb">
              가이드런 알아보기
            </Text>
            <Icon
              aria-hidden={true}
              color="text.tertiary"
              icon="external-link-lined"
              size={16}
            />
          </GuideRunInfoButton>
        </GuideRunInfoSection>

        <ActionSection>
          <BrowseLinkButton type="button" onClick={handleBrowseWithoutSignup}>
            <Text color="text.brand" font="body-m-sb">
              가입없이 둘러보기
            </Text>
          </BrowseLinkButton>

          <LoginButtonGroup>
            <KakaoLoginButton onClick={handleKakaoLogin} />
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

const GuideRunInfoButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing['3xl']}`};
  border: 1px solid ${({ theme }) => theme.color.border.default};
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: transparent;
  cursor: pointer;
  appearance: none;

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

const BrowseLinkButton = styled.button`
  padding: ${({ theme }) => `${theme.pxToRem(3)} 0`};
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.text.brand};
  background-color: transparent;
  cursor: pointer;
  appearance: none;

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
