import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

import KakaoSymbol from '../assets/kakao-symbol.svg?react';

type KakaoLoginButtonProps = ComponentPropsWithoutRef<'button'>;

export const KakaoLoginButton = ({
  type = 'button',
  ...props
}: KakaoLoginButtonProps): ReactElement => {
  return (
    <StyledButton type={type} {...props}>
      <LogoArea>
        <KakaoSymbol aria-hidden={true} />
      </LogoArea>
      <LabelArea>
        <Text align="center" font="body-l-sb">
          카카오 계정으로 로그인
        </Text>
      </LabelArea>
    </StyledButton>
  );
};

/* 카카오 브랜드 고정 색상 — 디자인 시스템 토큰 대상이 아니므로 raw 값 사용 */
const KAKAO_YELLOW = '#fee500';
const KAKAO_DARK_CONTENT_COLOR = '#000000';

const StyledButton = styled.button`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.pxToRem(54)} minmax(0, 1fr) ${({ theme }) => theme.pxToRem(54)};
  align-items: center;
  align-self: stretch;
  width: 100%;
  height: ${({ theme }) => theme.pxToRem(54)};
  padding: ${({ theme }) => theme.spacing.none};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  box-sizing: border-box;
  background: ${KAKAO_YELLOW};
  color: ${({ theme }) => theme.color.text.primary};
  overflow: hidden;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }

  html[data-color-mode='dark'] & {
    color: ${KAKAO_DARK_CONTENT_COLOR};
  }

  @media (prefers-color-scheme: dark) {
    html:not([data-color-mode='light']) & {
      color: ${KAKAO_DARK_CONTENT_COLOR};
    }
  }
`;

const LogoArea = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  svg {
    width: ${({ theme }) => theme.pxToRem(24)};
    height: ${({ theme }) => theme.pxToRem(24)};
  }
`;

const LabelArea = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;
