import styled from '@emotion/styled';

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
