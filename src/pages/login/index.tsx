import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import {
  FooterButton,
  FormPageLayout,
  Input,
  PageLayout,
} from '@/components';
import { api } from '@/api/services';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';

const LOGIN_FORM_ID = 'login-form';
const LOGIN_ERROR_MESSAGE = '아이디 또는 비밀번호를 확인해주세요';

export const LoginPage = (): ReactElement => {
  const navigate = useNavigate();
  const { startSession } = useAuth();

  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = accountId.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorText('');

    try {
      const { accessToken } = await api.auth.loginPost({ accountId, password });
      await startSession(accessToken);
      navigate(APP_PATH.HOME, { replace: true });
    } catch {
      setErrorText(LOGIN_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFindId = () => {
    navigate(APP_PATH.ACCOUNT_FIND);
  };

  const handleFindPassword = () => {
    navigate(APP_PATH.ACCOUNT_FIND);
  };

  return (
    <PageLayout background="bg.default">
      <FormPageLayout
        topNavigation={{
          left: {
            icon: 'chevron-left-lined',
            ariaLabel: '이전 페이지로 이동',
            onClick: () => navigate(-1),
          },
          right: [
            {
              icon: 'close-lined',
              ariaLabel: '닫기',
              onClick: () => navigate(APP_PATH.INTRO),
            },
          ],
        }}
        title={'기존에 등록한\n계정으로 로그인해주세요'}
        description="계정이 없다면, 먼저 카카오톡으로 가입해주세요"
      >
        <Container
          aria-label="아이디 로그인"
          id={LOGIN_FORM_ID}
          onSubmit={handleSubmit}
        >
          <Input
            autoComplete="username"
            error={Boolean(errorText)}
            label="아이디"
            placeholder="아이디"
            value={accountId}
            onChange={(event) => {
              setAccountId(event.target.value);
              setErrorText('');
            }}
          />
          <Input
            autoComplete="current-password"
            errorText={errorText}
            label="비밀번호"
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrorText('');
            }}
          />

          <FindAccountRow>
            <FindAccountButton type="button" onClick={handleFindId}>
              아이디 찾기
            </FindAccountButton>
            <Divider aria-hidden={true} />
            <FindAccountButton type="button" onClick={handleFindPassword}>
              비밀번호 찾기
            </FindAccountButton>
          </FindAccountRow>
        </Container>

        <FooterButton>
          <FooterButton.Button
            disabled={!canSubmit || isSubmitting}
            form={LOGIN_FORM_ID}
            fullWidth
            size="l"
            type="submit"
          >
            다음
          </FooterButton.Button>
        </FooterButton>
      </FormPageLayout>
    </PageLayout>
  );
};

const Container = styled.form(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing['2xl'],
}));

const FindAccountRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBlock: theme.spacing.md,
  gap: theme.spacing['2xl'],
}));

const FindAccountButton = styled.button(({ theme }) => ({
  border: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  appearance: 'none',
  // 디자인 전용 타이포 — 매칭되는 typography 토큰이 없어 raw 값 사용 (fontWeight만 토큰)
  color: theme.color.text.primary,
  textAlign: 'center',
  fontSize: '0.875rem',
  fontWeight: theme.fontWeight.medium,
  lineHeight: '150%',
  letterSpacing: '-0.0175rem',

  '&:focus-visible': {
    outline: `2px solid ${theme.color.border.focused}`,
    outlineOffset: theme.spacing.xs,
  },
}));

const Divider = styled.span(({ theme }) => ({
  alignSelf: 'stretch',
  width: theme.pxToRem(1.4),
  backgroundColor: theme.color.border.subtle,
}));
