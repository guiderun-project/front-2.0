import { useEffect, useRef, useState, type ReactElement } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { api } from '@/api/services';
import { PageLayout, Text } from '@/components';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

type Status = 'processing' | 'error';

export const KakaoOAuthPage = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { startSession } = useAuth();
  const [status, setStatus] = useState<Status>('processing');
  const handledRef = useRef(false);

  useEffect(() => {
    // React StrictMode 의 effect 이중 실행 및 인가 코드 재사용 방지
    if (handledRef.current) return;
    handledRef.current = true;

    const code = searchParams.get('code');

    if (!code) {
      navigate(APP_PATH.INTRO, { replace: true });
      return;
    }

    const handleKakaoCallback = async () => {
      try {
        const result = await api.auth.kakaoOAuthLoginPost({ code });

        if (result.status === 'SIGNUP_REQUIRED') {
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
        navigate(APP_PATH.HOME, { replace: true });
      } catch {
        setStatus('error');
      }
    };

    void handleKakaoCallback();
  }, [searchParams, navigate, startSession]);

  return (
    <PageLayout background="bg.subtle">
      <Text align="center" color="text.secondary" font="body-m-m">
        {status === 'processing'
          ? '카카오 로그인 처리 중이에요...'
          : '로그인에 실패했어요. 다시 시도해 주세요.'}
      </Text>
    </PageLayout>
  );
};
