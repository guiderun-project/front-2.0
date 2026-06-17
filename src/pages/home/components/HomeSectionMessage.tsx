import styled from "@emotion/styled";

// TODO: 디자인 확정 시 로딩/에러/빈 상태 메시지 UI로 교체
export const HomeSectionMessage = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing.md,
  minHeight: theme.pxToRem(96),
  padding: theme.spacing.lg,
  color: theme.color.text.tertiary,
  textAlign: "center",
  ...theme.typography["body-m-m"],
}));
