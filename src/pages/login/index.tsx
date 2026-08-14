import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react';

import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '@/api/core';
import { api } from '@/api/services';
import {
  FooterButton,
  FormPageLayout,
  HiddenText,
  Input,
  PageLayout,
} from '@/components';
import { ACCOUNT_FIND_TYPE } from '@/constants';
import { useAuth } from '@/contexts';
import { APP_PATH } from '@/router/path';
import { peekReturnPath } from '@/router/returnPath';

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
      navigate(peekReturnPath() ?? APP_PATH.HOME, { replace: true });
    } catch (error) {
      setErrorText(getApiErrorMessage(error, LOGIN_ERROR_MESSAGE));
    } finally {
      setIsSubmitting(false);
    }
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
            <FindAccountLink
              to={`${APP_PATH.ACCOUNT_FIND}?type=${ACCOUNT_FIND_TYPE.ID}`}
            >
              아이디 찾기
            </FindAccountLink>
            <Divider aria-hidden={true} />
            <FindAccountLink
              to={`${APP_PATH.ACCOUNT_FIND}?type=${ACCOUNT_FIND_TYPE.PASSWORD}`}
            >
              비밀번호 찾기
            </FindAccountLink>
          </FindAccountRow>

          {/* 제출 진행 상태 스크린리더 안내 — 상시 마운트 리전에 텍스트만 교체 */}
          <HiddenText role="status">
            {isSubmitting ? '로그인 중이에요' : ''}
          </HiddenText>
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

// 페이지 이동 동작이라 button 대신 Link(앵커) 시맨틱 사용 — 스크린리더 '링크' 탐색에 노출
const FindAccountLink = styled(Link)(({ theme }) => ({
  // 전환 전 button UA 기본 패딩은 엔진별로 달랐음(Blink 1px/6px, WebKit iOS 0/6px,
  // WebKit macOS 2px 3px/6px, Gecko 1px/4px). 주 타겟인 iOS Safari 값 기준
  // 0 / 6px(spacing.sm)로 전 브라우저 통일 — 기존 렌더 대비 차이는 엔진별 1~2px 이내
  padding: `0 ${theme.spacing.sm}`,
  border: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textDecoration: 'none',
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
