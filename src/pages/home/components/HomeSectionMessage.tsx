import styled from '@emotion/styled';

/**
 * 홈 섹션의 로딩/에러/빈 상태 메시지 영역.
 * 로딩에는 role="status", 에러에는 role="alert"를 부여해 스크린리더에 전달한다.
 */
export const HomeSectionMessage = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md,
  minHeight: theme.pxToRem(96),
  padding: theme.spacing.lg,
  color: theme.color.text.tertiary,
  fontFamily: theme.typography['body-m-m'].fontFamily,
  fontSize: theme.typography['body-m-m'].fontSize,
  fontWeight: theme.typography['body-m-m'].fontWeight,
  letterSpacing: theme.typography['body-m-m'].letterSpacing,
  lineHeight: theme.typography['body-m-m'].lineHeight,
  textAlign: 'center',
}));
