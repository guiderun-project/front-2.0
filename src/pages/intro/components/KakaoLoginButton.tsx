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
        <Text align="center" color="text.primary" font="body-m-sb">
          카카오 계정으로 로그인
        </Text>
      </LabelArea>
    </StyledButton>
  );
};

/* 카카오 브랜드 고정 색상 — 디자인 시스템 토큰 대상이 아니므로 raw 값 사용 */
const KAKAO_YELLOW = '#fee500';

const StyledButton = styled.button`
  display: flex;
  align-items: stretch;
  align-self: stretch;
  gap: ${({ theme }) => theme.spacing.none};
  padding: ${({ theme }) => theme.spacing.none};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${KAKAO_YELLOW};
  overflow: hidden;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }
`;

const LogoArea = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.73531rem;
  width: 3.75rem;
  padding: 1.02944rem;
  color: ${({ theme }) => theme.color.text.primary};

  svg {
    width: ${({ theme }) => theme.pxToRem(18)};
    height: ${({ theme }) => theme.pxToRem(18)};
  }
`;

const LabelArea = styled.span`
  display: flex;
  flex: 1 0 0;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  padding: ${({ theme }) => `${theme.spacing.xl} 0.875rem ${theme.spacing.xl} ${theme.spacing.none}`};
`;
