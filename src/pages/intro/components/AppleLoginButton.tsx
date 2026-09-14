import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import styled from '@emotion/styled';

import { Text } from '@/components';

import AppleSymbol from '../assets/apple-symbol.svg?react';

type AppleLoginButtonProps = ComponentPropsWithoutRef<'button'>;

export const AppleLoginButton = ({
  type = 'button',
  disabled,
  ...props
}: AppleLoginButtonProps): ReactElement => {
  return (
    <StyledButton
      aria-busy={disabled || undefined}
      aria-label={disabled ? 'Apple 로그인 연결 중' : 'Apple로 로그인'}
      disabled={disabled}
      type={type}
      {...props}
    >
      <LogoArea>
        <AppleLogo aria-hidden={true} />
      </LogoArea>
      <LabelArea>
        <Text align="center" font="body-l-sb">
          Apple로 로그인
        </Text>
      </LabelArea>
      <Placeholder />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.pxToRem(54)} minmax(0, 1fr) ${({ theme }) => theme.pxToRem(54)};
  align-items: center;
  align-self: stretch;
  width: 100%;
  height: ${({ theme }) => theme.pxToRem(54)};
  padding: ${({ theme }) => theme.spacing.none};
  border: ${({ theme }) => theme.pxToRem(1)} solid ${({ theme }) => theme.color.border.strong};
  border-radius: ${({ theme }) => theme.radius.md};
  /* Apple 버튼 브랜딩은 흰 배경과 검은 콘텐츠만 허용한다. */
  background: #FFF;
  color: #000;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.border.focused};
    outline-offset: ${({ theme }) => theme.spacing.xs};
  }
`;

const LogoArea = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppleLogo = styled(AppleSymbol)`
  height: ${({ theme }) => theme.pxToRem(24)};
  width: auto;
`;

const LabelArea = styled.span`
  min-width: 0;
`;

const Placeholder = styled.span`
  width: 100%;
  height: 100%;
`;
