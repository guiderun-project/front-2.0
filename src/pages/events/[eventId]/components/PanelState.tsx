import { useEffect, useState, type ReactElement } from 'react';

import styled from '@emotion/styled';

import { HiddenText } from '@/components';

export const PanelState = styled.div(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  minHeight: theme.pxToRem(180),
  padding: theme.spacing['2xl'],
  boxSizing: 'border-box',
  color: theme.color.text.tertiary,
  fontFamily: theme.typography['body-m-m'].fontFamily,
  fontSize: theme.typography['body-m-m'].fontSize,
  fontWeight: theme.typography['body-m-m'].fontWeight,
  letterSpacing: theme.typography['body-m-m'].letterSpacing,
  lineHeight: theme.typography['body-m-m'].lineHeight,
  textAlign: 'center',
}));

export const PageState = styled(PanelState)(({ theme }) => ({
  minHeight: `calc(100dvh - ${theme.pxToRem(56)})`,
}));

type AnnouncedPanelStateProps = {
  children: string;
  role: 'alert' | 'status';
};

// 로딩/오류/빈 상태 문구를 라이브 리전으로 낭독시키는 PanelState 래퍼.
// 콘텐츠를 담은 채 삽입된 리전은 iOS VoiceOver 가 낭독하지 않을 수 있어,
// 가시 텍스트는 즉시 렌더하고(첫 프레임 빈 화면 방지), 낭독용 텍스트만
// 별도의 숨김 리전에 다음 프레임에 채운다. 가시 텍스트는 숨김 리전과의
// 중복 낭독을 막기 위해 aria-hidden 처리한다.
export const AnnouncedPanelState = ({
  children,
  role,
}: AnnouncedPanelStateProps): ReactElement => {
  const [announcedMessage, setAnnouncedMessage] = useState('');

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setAnnouncedMessage(children);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [children]);

  return (
    <PanelState>
      <span aria-hidden={true}>{children}</span>
      <HiddenText role={role}>{announcedMessage}</HiddenText>
    </PanelState>
  );
};
